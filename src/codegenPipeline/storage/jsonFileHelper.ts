import { file } from "bun";
import { Mutex, toMerged } from "es-toolkit";

export type Filter<Item> = Record<string, (item: Item) => boolean>;
type noFilter<Item> = Record<never, (item: Item) => boolean>;

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
        const data: Array<Item> = await file(path).json();
        if (!type) return data;
        const filter = filters?.[type];
        if (!filter) return data;
        return data.filter(filter);
    };

    const save = async (pluginsList: Array<Item>) => file(path).write(JSON.stringify(persistor(pluginsList), null, 2));

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
