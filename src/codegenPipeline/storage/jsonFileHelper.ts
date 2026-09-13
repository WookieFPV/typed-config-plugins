import { rename } from "node:fs/promises";
import { file } from "bun";
import { Mutex, toMerged } from "es-toolkit";

export type Filter<Item> = Record<string, (item: Item) => boolean>;
type noFilter<Item> = Record<never, (item: Item) => boolean>;

/** A partial row to merge into an existing one - the primary key is what identifies the target. */
type Patch<Item, Key extends keyof Item> = Partial<Item> & Pick<Item, Key>;

// A non-array root means the file itself is corrupt/truncated - that's not a single bad row,
// it's the whole file, so it should still fail loudly.
// A single malformed row (hand-edited entry, or - for externally-sourced files like the
// react-native-directory download - a row the upstream data owner shipped) should NOT abort
// every subsequent pipeline step; drop it and name it loudly instead.
const assertValidRows = <Item>(path: string, primaryKey: keyof Item, data: unknown): Array<Item> => {
    if (!Array.isArray(data)) throw new Error(`${path}: expected a JSON array, got ${typeof data}`);
    return data.filter((item, index) => {
        if (typeof item !== "object" || item === null) {
            console.warn(`${path}[${index}]: dropping row, expected an object, got ${JSON.stringify(item)}`);
            return false;
        }
        const value = (item as Record<string, unknown>)[primaryKey as string];
        if (value === undefined || value === "") {
            console.warn(`${path}[${index}]: dropping row missing required key "${String(primaryKey)}" - ${JSON.stringify(item).slice(0, 200)}`);
            return false;
        }
        return true;
    }) as Array<Item>;
};

export const jsonPersistorFactory = <Item, Filters extends Filter<Item> = noFilter<Item>, Key extends keyof Item = keyof Item>({
    path,
    filters = {} as Filters,
    persistor = (item) => item,
    primaryKey,
}: {
    path: string;
    filters?: Filters;
    persistor?: (item: Item[]) => Item[];
    primaryKey: Key;
}) => {
    const mutex = new Mutex();

    const load = async (type?: keyof Filters): Promise<Array<Item>> => {
        const raw = await file(path).json();
        const data = assertValidRows<Item>(path, primaryKey, raw);
        const filter = type ? filters[type] : undefined;
        return filter ? data.filter(filter) : data;
    };

    const save = async (pluginsList: Array<Item>) => {
        // Write-then-rename instead of writing the real path directly: a process killed mid-write
        // (CI timeout, OOM) would otherwise leave this file - the single source of truth for the
        // whole pipeline - truncated or invalid, corrupting every subsequent run. `rename` on the
        // same filesystem is atomic, so readers only ever see the old or the fully-written file.
        const tmpPath = `${path}.tmp`;
        await file(tmpPath).write(JSON.stringify(persistor(pluginsList), null, 2));
        await rename(tmpPath, path);
    };

    const mergeRows = (baseList: Item[], patches: Array<Patch<Item, Key>>, override: boolean): Item[] => {
        const list = [...baseList];

        for (const patch of patches) {
            const index = list.findIndex((row) => row[primaryKey] === patch[primaryKey]);
            const existing = index === -1 ? undefined : list[index];
            if (existing) {
                list[index] = override ? toMerged(existing, patch) : toMerged(patch, existing);
            } else {
                // No row to merge into - callers that introduce new keys always pass complete rows,
                // partial patches only ever target rows that already exist.
                list.push(patch as Item);
            }
        }
        return list;
    };

    /** Merges `items` into the stored rows by primary key, appending the ones that don't exist yet. */
    const update = async (items: Array<Patch<Item, Key>>, { override = true }: { override?: boolean } = {}): Promise<void> => {
        await mutex.acquire();
        try {
            await save(mergeRows(await load(), items, override));
        } finally {
            mutex.release();
        }
    };

    return { load, save, update, path };
};
