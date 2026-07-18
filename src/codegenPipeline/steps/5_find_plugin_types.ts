import { mapAsync } from "es-toolkit/array";
import { computePackageExportFlag } from "../searchTypes/computePackageExportFlag";
import { findBestConfigPluginTypePathCombined } from "../searchTypes/findPluginTypePathCombined";
import { isExpectedExportsBlock } from "../searchTypes/isExpectedExportsBlock";
import { verifyExportType } from "../searchTypes/verifyExportType";
import { packageListFile } from "../storage/mainPackageList";
import { stepLogger } from "../utils/logger";
import type { RnDepPersist } from "../utils/types";

const { logger, step } = stepLogger("Find Config Plugin Type Path");

// A `.d.ts` file existing on disk doesn't mean it ships the export we're about to reference
// (e.g. `typeof import("...")["default"]`). We verify that with the real TypeScript checker so
// broken packages get flagged here instead of surfacing as a `tsc` failure after codegen.
//
// A manually pinned `override.path` (added when auto-discovery gets it wrong) is what codegen
// actually emits (see `codeTerminalOutput.ts`: `override.path ?? types?.path`), so it - not the
// freshly auto-discovered `typePath` - is what must be validated here.
export const checkValidity = (dep: RnDepPersist, typePath: string, packageExport: boolean | undefined): { valid: boolean; error?: string; exportName: string } => {
    const overrideName = dep?.types?.override?.name;
    const overrideValid = dep?.types?.override?.valid;
    if (overrideValid !== undefined) return { valid: overrideValid, exportName: overrideName ?? "default" };

    const effectivePath = dep?.types?.override?.path ?? typePath;
    const exportName = overrideName ?? "default";
    const result = verifyExportType(effectivePath, exportName);
    if (result.valid || isExpectedExportsBlock(result, packageExport)) return { valid: true, exportName };

    // Some packages declare their plugin via `export = ConfigPlugin<...>` instead of a `default`
    // export (e.g. `expo-gradle-jvmargs`) - `["default"]` never resolves for those, so retry
    // against the bare module type before giving up. Skipped when a human pinned an explicit
    // export name - that pin is authoritative, not something to second-guess.
    if (overrideName === undefined) {
        const bareResult = verifyExportType(effectivePath, null);
        if (bareResult.valid) return { valid: true, exportName: "" };
    }

    return { valid: false, error: result.error, exportName };
};

const mapPluginTypes = async (dep: RnDepPersist): Promise<RnDepPersist> => {
    // A pinned override (`ignore`, or an explicit `valid`) is a human's standing decision about
    // this package - respect it the same way step 5b's revalidation does, instead of letting a
    // `full` re-scan silently overwrite it with a fresh (and possibly worse) auto-discovered result.
    if (dep.types?.path && (dep.types?.override?.ignore || dep.types?.override?.valid !== undefined)) return dep;

    try {
        const typePath = await findBestConfigPluginTypePathCombined(dep.npmPkg);
        const effectivePath = dep?.types?.override?.path ?? typePath;
        const packageExport = computePackageExportFlag(dep.npmPkg, effectivePath);
        const { valid, error, exportName } = checkValidity(dep, typePath, packageExport);
        return {
            ...dep,
            types: {
                ...dep.types,
                path: typePath,
                error,
                packageExport,
                valid,
                exportName,
            },
        };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "unknown error message";
        return { ...dep, types: { ...dep.types, path: undefined as unknown as string, valid: false, error: msg } };
    }
};

export const findConfigPluginTypePath = step(async (type: "onlyNew" | "full" = "onlyNew"): Promise<Array<RnDepPersist>> => {
    const packagesToCheck = await packageListFile.load(type === "full" ? "withPlugin" : "withPluginWithoutTypePath");
    if (packagesToCheck.length) logger.log(`Find Config Plugin: ${packagesToCheck.length}`);

    const fulfilled = await mapAsync(packagesToCheck, mapPluginTypes, { concurrency: 20 });

    // Plain replace-by-key rather than `packageListFile.update()` - `mapPluginTypes` already
    // returns a complete `types` object, and `update()`'s deep merge silently keeps a stale field
    // (e.g. a leftover `packageExport: true`) whenever the freshly computed value is `undefined`
    // (see the same workaround in `5b_revalidate_plugin_types.ts`).
    const byKey = new Map(fulfilled.map((dep) => [dep.githubUrl, dep]));
    const allPackages = await packageListFile.load();
    const merged = allPackages.map((dep) => byKey.get(dep.githubUrl) ?? dep);
    await packageListFile.save(merged);

    return fulfilled;
});
