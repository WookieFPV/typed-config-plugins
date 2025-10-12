import { file } from "bun";
import { getConfigPluginTypeCode } from "../codegen/codeTerminalOutput";
import { cleanupPath } from "../codegen/utils/cleanupPath";
import { findBestConfigPluginTypePath } from "../codegen/utils/findConfigPluginTypePath";
import { findModuleImplementation } from "../codegen/utils/resolveDefaultExportPath";
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
        return cleanupPath(await findModuleImplementation(packageName));
    } catch (_e) {
        return await findBestConfigPluginTypePath(packageName, "ConfigPlugin", ".d.ts");
    }
};
