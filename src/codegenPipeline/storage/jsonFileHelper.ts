import { rename } from "node:fs/promises";
import { file } from "bun";
import { Mutex, toMerged } from "es-toolkit";

export type Filter<Item> = Record<string, (item: Item) => boolean>;
type noFilter<Item> = Record<never, (item: Item) => boolean>;

// A hand-edited entry, a truncated write from a previous crash, or an upstream schema change
// should fail loudly and name the offending row - not flow silently through 8 pipeline steps
// until something downstream breaks in a confusing way.
const assertValidRows = <Item>(path: string, primaryKey: keyof Item, data: unknown): Array<Item> => {
    if (!Array.isArray(data)) throw new Error(`${path}: expected a JSON array, got ${typeof data}`);
    data.forEach((item, index) => {
        if (typeof item !== "object" || item === null) {
            throw new Error(`${path}[${index}]: expected an object, got ${JSON.stringify(item)}`);
        }
        const value = (item as Record<string, unknown>)[primaryKey as string];
        if (!value) {
            throw new Error(`${path}[${index}]: missing required key "${String(primaryKey)}" - ${JSON.stringify(item).slice(0, 200)}`);
        }
    });
    return data as Array<Item>;
};

export const jsonPersistorFactory = <Item, Filter extends Record<string, (item: Item) => boolean> = noFilter<Item>>({
    path,
    filters = {} as Filter,
    persistor = (item) => item,
    primaryKey,
    updateType,
}: {
    path: string;
    filters?: Filter;
    persistor?: (item: Item[]) => Item[];
    primaryKey: keyof Item;
    updateType?: keyof Filter;
}) => {
    const mutex = new Mutex();

    const load = async (type?: keyof typeof filters): Promise<Array<Item>> => {
        const raw = await file(path).json();
        const data = assertValidRows<Item>(path, primaryKey, raw);
        if (!type) return data;
        const filter = filters?.[type];
        if (!filter) return data;
        return data.filter(filter);
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

    const update = async (
        items: Item[],
        {
            override = true,
            type = updateType,
        }: {
            override?: boolean;
            type?: keyof typeof filters;
        } = {},
    ): Promise<void> => {
        await mutex.acquire();
        const pluginsList = await load(type);
        const mergedList = mergePluginLists(pluginsList, items, override);
        await save(mergedList);
        mutex.release();
    };

    const mergePluginLists = (baseList: Item[], updatedList: Item[], override = true): Item[] => {
        const list = [...baseList];

        updatedList.forEach((plugin) => {
            const index = list.findIndex((p) => p[primaryKey] === plugin[primaryKey]);
            if (index !== -1 && list[index] && plugin) {
                list[index] = override ? toMerged(list[index], plugin) : toMerged(plugin, list[index]);
            } else {
                list.push(plugin);
            }
        });
        return list;
    };

    return {
        load,
        save,
        update,
        path,
    };
};
