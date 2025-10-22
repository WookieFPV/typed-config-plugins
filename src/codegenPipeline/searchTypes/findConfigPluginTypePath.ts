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
                if (line.includes(searchString)) {
                    results.push({ file: getPathRelativeToNodeModules(file), line }); //
                }
            });
        } catch (error) {
            console.error(`Error reading file ${file}:`, error);
        }
    }
    if (!results.length) throw Error("Package doesn't ship an app.plugin.js file");
    return results;
};

export const findBestConfigPluginTypePath = async (packageName: string, searchString: string = "ConfigPlugin", fileExtension: string = ".d.ts"): Promise<string> => {
    const results = await findConfigPluginTypePath(packageName, searchString, fileExtension);

    // Sort by file path length to prioritize top-level files
    results.sort((a, b) => a.file.length - b.file.length);

    // dedupe file list:
    const files = [...new Set(results.map((result) => result.file))];

    if (files.length === 0) throw Error("Package doesn't ship types for app.plugin.js");
    // biome-ignore lint/style/noNonNullAssertion: fine here
    if (files.length === 1) return files[0]!;

    // biome-ignore lint/style/noNonNullAssertion: fine here
    return files[0]!;
};

const getPathRelativeToNodeModules = (file: string) => {
    const pathParts = file.split(path.sep);
    const nodeModulesIndex = pathParts.lastIndexOf("node_modules");
    const nodeModulesPath = pathParts.slice(0, nodeModulesIndex + 1).join(path.sep);
    return path.relative(nodeModulesPath, file);
};

const _dedupe = (result: Result): string[] => {
    const deduped = new Set(result.map((item) => item.file));
    return [...deduped];
};
