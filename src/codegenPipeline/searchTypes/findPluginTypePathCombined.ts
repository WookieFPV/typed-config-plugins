import path from "node:path";
import { cleanupPath } from "../codegen/cleanupPath";
import { findBestConfigPluginTypePath } from "./findConfigPluginTypePath";
import { findModuleImplementation } from "./resolveDefaultExportPath";

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
