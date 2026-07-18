import path from "node:path";
import { mapAsync } from "es-toolkit/array";
import { findBestConfigPluginTypePathCombined } from "../searchTypes/findPluginTypePathCombined";
import { verifyExportType } from "../searchTypes/verifyExportType";
import { packageListFile } from "../storage/mainPackageList";
import { stepLogger } from "../utils/logger";
import type { RnDepPersist } from "../utils/types";

const { logger, step } = stepLogger("Find Config Plugin Type Path");

const isUsingExportPackageJson = async (npmPkg: string) => {
    const packageJsonPath = path.join("node_modules", npmPkg, "package.json");
    const json = await Bun.file(packageJsonPath).json();
    return "exports" in json ? true : undefined;
};

// A `.d.ts` file existing on disk doesn't mean it ships the export we're about to reference
// (e.g. `typeof import("...")["default"]`). We verify that with the real TypeScript checker so
// broken packages get flagged here instead of surfacing as a `tsc` failure after codegen.
const checkValidity = (dep: RnDepPersist, typePath: string): { valid: boolean; error?: string } => {
    const overrideValid = dep?.types?.override?.valid;
    if (overrideValid !== undefined) return { valid: overrideValid };

    const exportName = dep?.types?.override?.name ?? "default";
    const result = verifyExportType(typePath, exportName);
    return result.valid ? { valid: true } : { valid: false, error: result.error };
};

const mapPluginTypes = async (dep: RnDepPersist): Promise<RnDepPersist> => {
    try {
        const typePath = await findBestConfigPluginTypePathCombined(dep.npmPkg);
        const packageExport = await isUsingExportPackageJson(dep.npmPkg);
        const { valid, error } = checkValidity(dep, typePath);
        return {
            ...dep,
            types: {
                ...dep.types,
                path: typePath,
                error,
                packageExport,
                valid,
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
    await packageListFile.update(fulfilled);

    return fulfilled;
});
