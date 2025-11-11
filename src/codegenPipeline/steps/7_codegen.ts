import { file } from "bun";
import { getConfigPluginTypeCode } from "../codegen/codeTerminalOutput";
import { stepLogger } from "../utils/logger";

const { step } = stepLogger("Generate Plugin Type Code");

export const codeGeneration = step(async () => {
    const result = await getConfigPluginTypeCode();
    await file("src/plugin/pluginTypes.ts").write(result);
});
