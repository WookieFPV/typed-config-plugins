import { sortBy } from "es-toolkit/array";
import { type Filter, jsonPersistorFactory } from "../storage/jsonFileHelper";

export type GitHubPersistItem = {
    githubUrl: string;
    npmPkgRaw: string;
    npmPkg?: string;
    origin: "gitHub";
};

const persistor = (items: GitHubPersistItem[]) => sortBy(items, ["githubUrl"]);

const filters = {
    withoutNpmPkg: (item) => !item.npmPkg,
} satisfies Filter<GitHubPersistItem>;

export const gitHubRepoList = jsonPersistorFactory<GitHubPersistItem, typeof filters>({
    primaryKey: "githubUrl",
    path: "src/codegenPipeline/data/input-github.json",
    persistor,
    filters,
});
