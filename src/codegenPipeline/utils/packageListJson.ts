import { file } from "bun";
import type { RnDep } from "./types";

const pluginListPath = "src/codegenPipeline/data/rn-packages.json";

export const packageListFile = (path = pluginListPath) => ({
    load: async (): Promise<Array<RnDep>> => file(path).json(),
    save: async (pluginsList: Array<RnDep>) => file(path).write(JSON.stringify(pluginsList, null, 2)),
});

export const updatePluginsListFile = async (enrichedPlugins: RnDep[]): Promise<void> => {
    const pluginsList = await packageListFile().load();

    const mergedList = mergePluginLists(pluginsList, enrichedPlugins);

    await packageListFile().save(mergedList);
};

export const mergePluginLists = (baseList: RnDep[], updatedList: RnDep[]): RnDep[] => {
    const list = [...baseList];

    updatedList.forEach((plugin) => {
        const index = list.findIndex((p) => p.githubUrl === plugin.githubUrl);
        if (index !== -1) {
            list[index] = { ...list[index], ...plugin };
        } else {
            list.push(plugin);
        }
    });
    return list;
};

export const mergePackageLists = async (path: string): Promise<void> => {
    const newList = await packageListFile(path).load();
    const localEnrichedList = await packageListFile().load();

    const mergedList = mergePluginLists(localEnrichedList, newList);

    await packageListFile().save(mergedList);
};
