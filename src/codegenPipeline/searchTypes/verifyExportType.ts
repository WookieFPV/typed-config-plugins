import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

// Verifies that `typeof import(importPath)[exportName]` actually type-checks the same way
// it will once written into the generated `src/plugin/pluginTypes.ts`. A `.d.ts` file can
// exist on disk (satisfying a plain "does the file exist" check) while shipping no matching
// export at all (e.g. an empty declaration file, or a named export instead of a default one).
// Using the real TypeScript checker instead of a heuristic is the only way to catch that
// reliably across arbitrary third-party packages and versions.

const projectRoot = process.cwd();
// Co-located with the real generated file so module resolution (relative node_modules
// lookup, tsconfig `include`/`paths`, etc.) behaves identically to the real build.
const virtualFileName = path.join(projectRoot, "src", "plugin", "__typecheck_virtual__.ts");

const loadCompilerOptions = (): ts.CompilerOptions => {
    const configPath = ts.findConfigFile(projectRoot, ts.sys.fileExists, "tsconfig.json");
    if (!configPath) return ts.getDefaultCompilerOptions();
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    return ts.parseJsonConfigFileContent(configFile.config, ts.sys, projectRoot).options;
};

let currentContent = "";
let version = 0;
let service: ts.LanguageService | null = null;

const getService = (): ts.LanguageService => {
    if (service) return service;

    const compilerOptions = loadCompilerOptions();
    const host: ts.LanguageServiceHost = {
        getScriptFileNames: () => [virtualFileName],
        getScriptVersion: (fileName) => (fileName === virtualFileName ? String(version) : "0"),
        getScriptSnapshot: (fileName) => {
            if (fileName === virtualFileName) return ts.ScriptSnapshot.fromString(currentContent);
            if (!fs.existsSync(fileName)) return undefined;
            return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
        },
        getCurrentDirectory: () => projectRoot,
        getCompilationSettings: () => compilerOptions,
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
        directoryExists: ts.sys.directoryExists,
        getDirectories: ts.sys.getDirectories,
    };

    service = ts.createLanguageService(host, ts.createDocumentRegistry());
    return service;
};

// TS2307: "Cannot find module '{0}' or its corresponding type declarations."
const CANNOT_FIND_MODULE = 2307;

export type ExportCheckResult = { valid: true } | { valid: false; error: string; moduleNotFound: boolean };

/**
 * Checks whether `typeof import(importPath)[exportName]` type-checks without errors.
 * `importPath` should be a bare specifier resolvable from `src/plugin/` (e.g. `"some-pkg/plugin/build/index"`),
 * matching exactly what ends up in the generated `ConfigPluginOptions<...>` line.
 *
 * Pass `exportName: null` to check the bare module type (`typeof import(importPath)`, no property
 * access) instead - some packages declare their plugin via `export = ConfigPlugin<...>` rather than
 * a `default` export, and only the bare module type resolves to the real function type for those.
 * That bare type-check alone would trivially "pass" for any resolvable module (even an empty one -
 * a module's namespace type always type-checks), so it additionally asserts the module type is
 * itself callable as `(config, props) => result`, matching `ConfigPlugin`'s shape.
 */
export const verifyExportType = (importPath: string, exportName: string | null = "default"): ExportCheckResult => {
    version++;
    currentContent =
        exportName === null
            ? `declare function __assertPlugin<T extends true>(): void;\ntype __Check = typeof import(${JSON.stringify(importPath)});\n__assertPlugin<__Check extends (config: any, props: any) => any ? true : false>();\nexport {};\n`
            : `type __Check = typeof import(${JSON.stringify(importPath)})[${JSON.stringify(exportName)}];\nexport {};\n`;

    const ls = getService();
    const diagnostics = [...ls.getSyntacticDiagnostics(virtualFileName), ...ls.getSemanticDiagnostics(virtualFileName)];

    if (diagnostics.length === 0) return { valid: true };

    const error = diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, " ")).join("; ");
    const moduleNotFound = diagnostics.every((d) => d.code === CANNOT_FIND_MODULE);
    return { valid: false, error, moduleNotFound };
};
