import path from "node:path";
import { Glob } from "bun";

type Result = { file: string; line: string }[];

/**
 * Search all files with file extension that contain a string
 */
export const findConfigPluginTypePath = async (packageName: string, searchString: string, fileExtension: string): Promise<Result> => {
    const glob = new Glob(`**/*${fileExtension}`);
    const searchPath = path.join(".", "node_modules", packageName);
    const deepNodeModulesIgnorePath = path.join(searchPath, "node_modules");

    const results: Result = [];
    for await (const file of glob.scan({ cwd: searchPath, absolute: true })) {
        if (file.includes(deepNodeModulesIgnorePath)) continue;
        try {
            const fileContent = await Bun.file(file).text();
            const lines = fileContent.split(";");

            lines.forEach((line) => {
                if (line.includes(searchString) && !line.includes("expo/config-plugins")) {
                    results.push({ file: getPathRelativeToNodeModules(file), line }); //
                }
            });
        } catch (error) {
            console.error(`Error reading file ${file}:`, error);
        }
    }
    if (!results.length) throw Error("Package doesn't ship types for app.plugin.js");
    return results;
};

export const findBestConfigPluginTypePath = async (packageName: string, searchString: string, fileExtension: string): Promise<string> => {
    const results = await findConfigPluginTypePath(packageName, searchString, fileExtension);

    if (results.length === 0) throw Error("Package doesn't ship types for app.plugin.js");
    // biome-ignore lint/style/noNonNullAssertion: fine here
    if (results.length === 1) return results[0]?.file!;

    const defaultExport = dedupe(results.filter((res) => res.line.includes("default")));
    if (defaultExport.length === 0) {
        // biome-ignore lint/style/noNonNullAssertion: fine here
        return results[0]?.file!;
    }
    // biome-ignore lint/style/noNonNullAssertion: fine here
    if (defaultExport.length === 1) return defaultExport[0]!;
    console.log(`
 ${packageName} found: ${results.length} packages: ${JSON.stringify(results)}`);

    throw Error("Package doesn't ship too many default types");
};

const getPathRelativeToNodeModules = (file: string) => {
    const pathParts = file.split(path.sep);
    const nodeModulesIndex = pathParts.lastIndexOf("node_modules");
    const nodeModulesPath = pathParts.slice(0, nodeModulesIndex + 1).join(path.sep);
    return path.relative(nodeModulesPath, file);
};

const dedupe = (result: Result): string[] => {
    const deduped = new Set(result.map((item) => item.file));
    return [...deduped];
};
