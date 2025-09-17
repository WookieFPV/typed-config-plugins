import { file } from "bun";
import { stepLogger } from "../utils/logger";
import { getConfigPluginTypeCode } from "./codeTerminalOutput";

const { logger } = stepLogger("Generate Plugin Type Code");

export const codeGeneration = async () => {
    logger.start();
    const result = await getConfigPluginTypeCode();
    await file("src/plugin/pluginTypes.ts").write(result);
    logger.finish();
};
