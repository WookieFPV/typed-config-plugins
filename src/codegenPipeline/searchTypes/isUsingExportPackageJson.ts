import { readPackageJson } from "./readPackageJson";

// A package.json `exports` map can block a deep subpath import (e.g. `pkg/plugin/build/index`)
// even when that file exists on disk - Node/TS report that identically to "module not found".
// This only checks whether the package declares an `exports` map at all (not whether it blocks
// this specific subpath), matching the codegen convention of suppressing the whole line with
// `@ts-expect-error` whenever a package uses `exports`, rather than trying to predict per-subpath.
export const isUsingExportPackageJson = (npmPkg: string): boolean | undefined => {
    const json = readPackageJson(npmPkg);
    return json && "exports" in json ? true : undefined;
};
