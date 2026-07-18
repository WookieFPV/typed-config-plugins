import { readPackageJson } from "./readPackageJson";

// Packages that restrict subpath imports via a package.json `exports` map still commonly
// whitelist an `app.plugin` entry point - the Expo/RN convention for the one path meant to be
// reachable by tooling from outside the package. Prefer that declared entry over reaching for an
// internal implementation path, which `exports` may block outright (see the
// `@react-native-firebase/*` incident this was added for) or relocate on a future release without
// warning. Some packages even attach a `types` condition to this exact subpath (e.g. pointing at
// their real `plugin/build/index.d.ts`), in which case TypeScript's own module resolution picks
// that up automatically - we just need to hand it the right specifier.
export const resolveAppPluginExportPath = (npmPkg: string): string | undefined => {
    const exportsMap = readPackageJson(npmPkg)?.exports;
    if (!exportsMap || typeof exportsMap !== "object") return undefined;

    // Prefer the extension-less key when the package exposes one - it matches the convention
    // already used throughout the generated file for packages without an `exports` map.
    if ("./app.plugin" in exportsMap) return `${npmPkg}/app.plugin`;
    if ("./app.plugin.js" in exportsMap) return `${npmPkg}/app.plugin.js`;
    return undefined;
};
