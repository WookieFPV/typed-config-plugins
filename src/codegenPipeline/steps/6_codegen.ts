import path from "node:path";
import { file } from "bun";
import { cleanupPath } from "../codegen/cleanupPath";
import { getConfigPluginTypeCode } from "../codegen/codeTerminalOutput";
import { findBestConfigPluginTypePath } from "../searchTypes/findConfigPluginTypePath";
import { findModuleImplementation } from "../searchTypes/resolveDefaultExportPath";
import { stepLogger } from "../utils/logger";

const { logger } = stepLogger("Generate Plugin Type Code");

export const codeGeneration = async () => {
    logger.start();
    const result = await getConfigPluginTypeCode();
    await file("src/plugin/pluginTypes.ts").write(result);
    logger.finish();
};

export const findBestConfigPluginTypePathCombined = async (packageName: string) => {
    try {
        const filePath = cleanupPath(await findModuleImplementation(packageName));

        const dtsFilePath = path.join("node_modules", `${filePath}.d.ts`);
        if (await Bun.file(dtsFilePath).exists()) return filePath;
        try {
            const dir = await findBestConfigPluginTypePath(packageName, "ConfigPlugin<", ".d.ts");
            return dir.replace(".d.ts", "");
        } catch (_e) {
            // There are no types shipped, return the implementation path as a placeholder instead of nothing :(
            return filePath;
        }
    } catch (_e) {
        const dir = await findBestConfigPluginTypePath(packageName, "ConfigPlugin<", ".d.ts");
        return dir.replace(".d.ts", "");
    }
};
