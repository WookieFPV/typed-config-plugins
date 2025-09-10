import type { Plugin } from "./types";
import { packageNameToCamelCase } from "./utils/packageNameToCamelCase";
import { findModuleImplementation } from "./utils/resolveDefaultExportPath";

export const getConfigPluginTypeCode = async (pluginList: Plugin[]): Promise<string> => {
    const generatedLines = { imports: [] as string[], options: [] as string[] };

    for (const res of pluginList) {
        try {
            const path = await findModuleImplementation(res.name);
            const name = packageNameToCamelCase(res.name);
            generatedLines.imports.push(`import type ${name} from '${path}';`);
            generatedLines.options.push(`'${res.name}': ConfigPluginOptions<typeof ${name}>,`);
        } catch (e) {
            console.debug("// Could not find file of ", res.name, "error:", e instanceof Error ? e.message : e);
        }
    }

    const template = `
${generatedLines.imports.join("\n")}
    
    
interface ThirdPartyPlugins {
    ${generatedLines.options.join("\n    ")}
}
`;

    return template;
};
