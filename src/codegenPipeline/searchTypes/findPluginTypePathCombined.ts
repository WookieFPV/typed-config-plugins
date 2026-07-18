import path from "node:path";
import { cleanupPath } from "../codegen/cleanupPath";
import { findBestConfigPluginTypePath } from "./findConfigPluginTypePath";
import { isUsingExportPackageJson } from "./isUsingExportPackageJson";
import { resolveAppPluginExportPath } from "./resolveAppPluginExportPath";
import { findModuleImplementation } from "./resolveDefaultExportPath";
import { verifyExportType } from "./verifyExportType";

const findTracedImplementationPath = async (packageName: string): Promise<{ path: string; hasTypes: boolean }> => {
    try {
        const filePath = cleanupPath(await findModuleImplementation(packageName));

        const dtsFilePath = path.join("node_modules", `${filePath}.d.ts`);
        if (await Bun.file(dtsFilePath).exists()) return { path: filePath, hasTypes: true };
        try {
            const dir = await findBestConfigPluginTypePath(packageName, "ConfigPlugin<", ".d.ts");
            return { path: dir.replace(".d.ts", ""), hasTypes: true };
        } catch (_e) {
            // There are no types shipped, return the implementation path as a placeholder instead of nothing :(
            return { path: filePath, hasTypes: false };
        }
    } catch (_e) {
        const dir = await findBestConfigPluginTypePath(packageName, "ConfigPlugin<", ".d.ts");
        return { path: dir.replace(".d.ts", ""), hasTypes: true };
    }
};

export const findBestConfigPluginTypePathCombined = async (packageName: string): Promise<string> => {
    if (!isUsingExportPackageJson(packageName)) {
        return (await findTracedImplementationPath(packageName)).path;
    }

    // The package restricts subpath imports via `exports`. Its declared `app.plugin` entry is
    // always externally reachable, but only worth preferring when it actually type-checks (e.g. a
    // package that attaches a `types` condition to it, like `expo-beacon`) - otherwise it resolves
    // to a plain, undeclared JS file (`TS7016: implicitly has an 'any' type`), which is strictly
    // worse than the real `.d.ts` the internal tracing below can usually still find. In that case,
    // reach for the internal path anyway (suppressed with `@ts-expect-error`, the convention this
    // file already relies on elsewhere) instead of surfacing an honest-but-needlessly-typeless
    // `unknown` for a package that does ship real types, just not through this specific entry.
    const appPluginExportPath = resolveAppPluginExportPath(packageName);
    if (appPluginExportPath && verifyExportType(appPluginExportPath, "default").valid) return appPluginExportPath;

    const traced = await findTracedImplementationPath(packageName);
    if (traced.hasTypes) return traced.path;

    return appPluginExportPath ?? traced.path;
};
