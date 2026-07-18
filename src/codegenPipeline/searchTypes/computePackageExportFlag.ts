import { isUsingExportPackageJson } from "./isUsingExportPackageJson";
import { resolveAppPluginExportPath } from "./resolveAppPluginExportPath";

// Drives the `@ts-expect-error [Package uses \`exports\`...]` suppression in codegen - only
// appropriate when the recorded `path` reaches past what the package's `exports` map actually
// allows external tools to import. When `path` IS the package's own declared `app.plugin` entry
// (see `resolveAppPluginExportPath`), that risk doesn't apply: the package itself promises this
// subpath is reachable, so a plain (unsuppressed) import is the correct, honest output.
export const computePackageExportFlag = (npmPkg: string, path: string | undefined): boolean | undefined => {
    if (!path || !isUsingExportPackageJson(npmPkg)) return undefined;
    return path === resolveAppPluginExportPath(npmPkg) ? undefined : true;
};
