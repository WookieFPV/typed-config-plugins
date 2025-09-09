import * as fs from "node:fs";
import * as path from "node:path";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import resolve from "resolve";

// This is a big pile of GPT code that looks like it works at first glance

/**
 * Finds the actual implementation file of a package's default export
 * @param packageName The name of the npm package to analyze
 * @returns The absolute path to the implementation file
 */
export async function findModuleImplementation(packageName: string): Promise<string> {
    try {
        const packageRoot = path.join("node_modules", packageName);
        // Find the package's root directory
        const entryPoint = path.join(packageRoot, "app.plugin.js");

        // console.debug("entryPoint", entryPoint);
        // Trace the implementation path
        const result = await traceImplementation(entryPoint, packageRoot);

        // More cross-platform compatible way to extract the module path
        const nodeModulesPath = path.join("node_modules/", "");
        let relativePath = result;

        if (result.includes(nodeModulesPath)) {
            const parts = result.split(nodeModulesPath);
            if (parts.length > 1) {
                // @ts-expect-error gpt ...
                relativePath = parts[1];
            }
        }

        // Remove .js extension if present
        // console.debug("relativePath", relativePath);
        return relativePath.replace(/\.js$/, "");
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to find implementation for ${packageName}: ${errorMessage}`);
    }
}

/**
 * Recursively traces re-exports until finding the actual implementation
 * @param filePath The current file to analyze
 * @param packageRoot The root directory of the package
 * @param visited Set of already visited files to prevent circular dependencies
 * @returns The absolute path to the implementation file
 */
async function traceImplementation(
    filePath: string,
    packageRoot: string,
    visited: Set<string> = new Set(),
): Promise<string> {
    // Prevent circular dependencies
    if (visited.has(filePath)) {
        throw new Error(`Circular dependency detected at ${filePath}`);
    }

    visited.add(filePath);

    // Read and parse the file
    const code = fs.readFileSync(filePath, "utf-8");
    const ast = parser.parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript", "exportDefaultFrom"],
    });

    let nextFile: string | null = null;
    let isImplementation = true;

    // Traverse the AST to find re-exports
    traverse(ast, {
        // Handle CommonJS: module.exports = require('./path')
        AssignmentExpression(nodePath) {
            if (
                t.isMemberExpression(nodePath.node.left) &&
                t.isIdentifier(nodePath.node.left.object, { name: "module" }) &&
                t.isIdentifier(nodePath.node.left.property, { name: "exports" }) &&
                t.isCallExpression(nodePath.node.right) &&
                t.isIdentifier(nodePath.node.right.callee, { name: "require" })
            ) {
                const requireArg = nodePath.node.right.arguments[0];
                if (t.isStringLiteral(requireArg)) {
                    nextFile = requireArg.value;
                    isImplementation = false;
                }
            }
        },

        // Handle ES Modules: export { default } from './path'
        ExportNamedDeclaration(nodePath) {
            if (nodePath.node.source) {
                const exportSpecifiers = nodePath.node.specifiers;
                for (const specifier of exportSpecifiers) {
                    if (
                        t.isExportSpecifier(specifier) &&
                        (t.isIdentifier(specifier.exported, { name: "default" }) ||
                            t.isIdentifier(specifier.local, { name: "default" }))
                    ) {
                        nextFile = nodePath.node.source.value;
                        isImplementation = false;
                        break;
                    }
                }
            }
        },

        // Handle ES Modules: export default from './path'
        ExportDefaultSpecifier(nodePath) {
            const parent = nodePath.parent;
            if (t.isExportNamedDeclaration(parent) && parent.source) {
                nextFile = parent.source.value;
                isImplementation = false;
            }
        },

        // Handle ES Modules: export default X
        ExportDefaultDeclaration(nodePath) {
            if (t.isIdentifier(nodePath.node.declaration)) {
                // This might be a re-export of a local import
                const name = nodePath.node.declaration.name;

                // Look for corresponding import
                traverse(ast, {
                    ImportDeclaration(importPath) {
                        const specifiers = importPath.node.specifiers;
                        for (const specifier of specifiers) {
                            if (t.isImportDefaultSpecifier(specifier) && t.isIdentifier(specifier.local, { name })) {
                                nextFile = importPath.node.source.value;
                                isImplementation = false;
                            }
                        }
                    },
                });
            }
        },
    });

    // If we found a re-export, resolve the path and continue tracing
    if (nextFile && !isImplementation) {
        const resolvedPath = resolveImportPath(nextFile, filePath, packageRoot);
        return traceImplementation(resolvedPath, packageRoot, visited);
    }

    // If no re-export was found, this is the implementation file
    return filePath;
}

/**
 * Resolves a relative import path to an absolute file path
 * @param importPath The import path from the source code
 * @param currentFile The file containing the import
 * @param packageRoot The root directory of the package
 * @returns The absolute path to the imported file
 */
function resolveImportPath(importPath: string, currentFile: string, _packageRoot: string): string {
    // Handle relative paths
    if (importPath.startsWith(".")) {
        const resolvedPath = path.resolve(path.dirname(currentFile), importPath);

        // Try to resolve with extensions
        for (const ext of [".js", ".jsx", ".ts", ".tsx"]) {
            const withExt = `${resolvedPath}${ext}`;
            if (fs.existsSync(withExt)) {
                return withExt;
            }
        }

        // Try as directory with index file
        for (const ext of [".js", ".jsx", ".ts", ".tsx"]) {
            const indexFile = path.join(resolvedPath, `index${ext}`);
            if (fs.existsSync(indexFile)) {
                return indexFile;
            }
        }

        throw new Error(`Could not resolve import: ${importPath} from ${currentFile}`);
    }

    // Handle package imports
    try {
        return resolve.sync(importPath, { basedir: path.dirname(currentFile) });
    } catch (_error) {
        throw new Error(`Could not resolve package import: ${importPath}`);
    }
}
