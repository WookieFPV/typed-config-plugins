import { packageListFile } from "../packagMetadataPipeline/utils/packageListJson";
import { cleanupPath } from "./utils/cleanupPath";
import { findModuleImplementation } from "./utils/resolveDefaultExportPath";

const line = (pkgName: string, importPath: string) => `"${pkgName}": ConfigPluginOptions<typeof import("${cleanupPath(importPath)}")["default"]>;`;

const emptyStrArr = (): string[] => [];

export const getConfigPluginTypeCode = async (): Promise<string> => {
    const generatedLines = {
        correct: emptyStrArr(),
        tsIgnored: emptyStrArr(),
        aliased: emptyStrArr(),
        pathOverrides: emptyStrArr(),
        untyped: emptyStrArr(),
    } satisfies Record<string, string[]>;

    const packageList = (await packageListFile().load()).filter((pkg) => pkg.hasConfigPlugin);

    for (const { npmPkg, override } of packageList) {
        if (!npmPkg) continue;
        try {
            // biome-ignore lint:  lint/complexity/useOptionalChain not possible here (because of false)
            const path = override && override["path"] ? override.path : await findModuleImplementation(npmPkg);
            if (override && override.tsIgnore === true) {
                generatedLines.tsIgnored.push("// @ts-expect-error [override]");
                generatedLines.tsIgnored.push(line(npmPkg, path));
                override.alias?.forEach((alias) => {
                    generatedLines.tsIgnored.push(line(alias, path));
                });
            } // biome-ignore lint:  lint/complexity/useOptionalChain not possible here (because of false)
            else if (override && override.path) {
                generatedLines.pathOverrides.push("// path-override:");
                generatedLines.pathOverrides.push(line(npmPkg, path));
                override.alias?.forEach((alias) => {
                    generatedLines.pathOverrides.push(line(alias, path));
                });
            } else if (override === false) {
                generatedLines.correct.push(line(npmPkg, path));
            } else if (override?.alias) {
                generatedLines.aliased.push("// aliased:");
                generatedLines.aliased.push(line(npmPkg, path));
                override.alias?.forEach((alias) => {
                    generatedLines.aliased.push(line(alias, path));
                });
            } else {
                generatedLines.untyped.push("// @ts-expect-error [Package doesn't ship types for app.plugin.js]");
                generatedLines.untyped.push(line(npmPkg, path));
                override?.alias?.forEach((alias) => {
                    generatedLines.untyped.push(line(alias, path));
                });
            }
        } catch (e) {
            console.debug("// Could not find file of ", npmPkg, "error:", e instanceof Error ? e.message : e);
        }
    }

    const template = `

interface ThirdPartyAutomatedPlugins {
    // Packages with ts-ignore override:
    ${generatedLines.tsIgnored.join("\n    ")}

    // Packages with manual path override:
    ${generatedLines.pathOverrides.join("\n    ")}
    
    // Packages with detected types:
    ${generatedLines.correct.join("\n    ")}
    
    // Packages with custom alias:
    ${generatedLines.aliased.join("\n    ")}
    
    // Packages without types:
    ${generatedLines.untyped.join("\n    ")}
}
`;

    return template;
};
