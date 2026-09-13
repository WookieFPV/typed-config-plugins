import path from "node:path";
import { Glob } from "bun";

type Result = { file: string; line: string }[];

const getPathRelativeToNodeModules = (file: string) => {
    const pathParts = file.split(path.sep);
    const nodeModulesIndex = pathParts.lastIndexOf("node_modules");
    const nodeModulesPath = pathParts.slice(0, nodeModulesIndex + 1).join(path.sep);
    return path.relative(nodeModulesPath, file);
};

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

            for (const line of fileContent.split(";")) {
                if (line.includes(searchString)) results.push({ file: getPathRelativeToNodeModules(file), line });
            }
        } catch (error) {
            console.error(`Error reading file ${file}:`, error);
        }
    }
    if (!results.length) throw Error("Package doesn't ship an app.plugin.js file");
    return results;
};

export const findBestConfigPluginTypePath = async (packageName: string, searchString: string = "ConfigPlugin", fileExtension: string = ".d.ts"): Promise<string> => {
    const results = await findConfigPluginTypePath(packageName, searchString, fileExtension);

    // Shortest path first, to prioritize top-level files over deeply nested ones.
    const files = [...new Set(results.map((result) => result.file))].sort((a, b) => a.length - b.length);

    if (files.length === 0) throw Error("Package doesn't ship types for app.plugin.js");

    // biome-ignore lint/style/noNonNullAssertion: guaranteed non-empty by the throw above
    return files[0]!;
};
