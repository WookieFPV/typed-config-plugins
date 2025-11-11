import { sortBy } from "es-toolkit/array";
import type { RnDepPersist } from "../utils/types";
import { type Filter, jsonPersistorFactory } from "./jsonFileHelper";

const toRnDepPersist = (deps: RnDepPersist[]): RnDepPersist[] =>
    sortBy(deps, ["githubUrl"]).map((pkg) => ({
        githubUrl: pkg.githubUrl,
        npmPkg: pkg.npmPkg,
        hasConfigPlugin: pkg.hasConfigPlugin,
        origin: pkg.origin,
        types: pkg.types,
        ignore: pkg.ignore,
        unmaintained: pkg.unmaintained,
    }));

const filterPresets = {
    unignored: (pkg: RnDepPersist) => !pkg.ignore,
    withoutNpmPkg: (pkg: RnDepPersist) => !pkg.ignore && !pkg.npmPkg,
    withNpmPkg: (pkg: RnDepPersist) => !!pkg.npmPkg && !pkg.ignore,
    withPlugin: (pkg: RnDepPersist) => !!pkg.npmPkg && !pkg.ignore && !!pkg.hasConfigPlugin,
    withPluginAndTypes: (pkg: RnDepPersist) => !!pkg.npmPkg && !pkg.ignore && !!pkg.hasConfigPlugin && !!pkg.types,
    unknownPlugin: (pkg: RnDepPersist) => !!pkg.npmPkg && !pkg.ignore && pkg.hasConfigPlugin === undefined,
    withPluginWithoutTypePath: (pkg: RnDepPersist) => !!pkg.npmPkg && !pkg.ignore && !!pkg.hasConfigPlugin && !pkg.types?.path,
} satisfies Filter<RnDepPersist>;

export const packageListFile = jsonPersistorFactory<RnDepPersist, typeof filterPresets>({
    filters: filterPresets,
    primaryKey: "githubUrl",
    path: "src/codegenPipeline/data/rn-packages.json",
    persistor: toRnDepPersist,
});
