import { sortBy } from "es-toolkit/array";
import { normalizeErrorPaths } from "../utils/normalizeErrorPaths";
import type { RnDepPersist } from "../utils/types";
import { type Filter, jsonPersistorFactory } from "./jsonFileHelper";

// This file is committed, so every value in it has to be reproducible on any machine. `types.error`
// is the one field fed by raw tool output (TypeScript diagnostics, thrown fs errors), which names
// files by absolute path - so it gets scrubbed here, on the single write path, rather than relying
// on every future error producer to remember (see `normalizeErrorPaths`).
const toPersistedTypes = (types: RnDepPersist["types"]): RnDepPersist["types"] => {
    if (!types?.error) return types;
    return { ...types, error: normalizeErrorPaths(types.error) };
};

const toRnDepPersist = (deps: RnDepPersist[]): RnDepPersist[] =>
    sortBy(deps, ["githubUrl"]).map((pkg) => ({
        githubUrl: pkg.githubUrl,
        npmPkg: pkg.npmPkg,
        hasConfigPlugin: pkg.hasConfigPlugin,
        origin: pkg.origin,
        types: toPersistedTypes(pkg.types),
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
