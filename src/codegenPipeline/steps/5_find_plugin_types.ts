import path from "node:path";
import pMap from "p-map";
import { findBestConfigPluginTypePathCombined } from "../searchTypes/findPluginTypePathCombined";
import { packageListFile } from "../storage/mainPackageList";
import { stepLogger } from "../utils/logger";
import type { RnDepPersist } from "../utils/types";

const { logger, step } = stepLogger("Find Config Plugin Type Path");

const hasDtsFile = async (typePath: string) => Bun.file(path.join("node_modules", typePath.endsWith(".d.ts") ? typePath : `${typePath}.d.ts`)).exists();

const isUsingExportPackageJson = async (npmPkg: string) => {
    const packageJsonPath = path.join("node_modules", npmPkg, "package.json");
    const json = await Bun.file(packageJsonPath).json();
    return "exports" in json ? true : undefined;
};

const mapPluginTypes = async (dep: RnDepPersist): Promise<RnDepPersist> => {
    try {
        const typePath = await findBestConfigPluginTypePathCombined(dep.npmPkg);
        const packageExport = await isUsingExportPackageJson(dep.npmPkg);
        return {
            ...dep,
            types: {
                ...dep.types,
                path: typePath,
                error: undefined,
                packageExport,
                valid: dep?.types?.override?.valid ?? (await hasDtsFile(typePath)),
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

    const fulfilled = await pMap(packagesToCheck, mapPluginTypes, { concurrency: 20 });
    await packageListFile.update(fulfilled);

    return fulfilled;
});
