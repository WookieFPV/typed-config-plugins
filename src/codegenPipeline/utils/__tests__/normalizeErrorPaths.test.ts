import { describe, expect, it } from "bun:test";
import { normalizeErrorPaths } from "../normalizeErrorPaths";

const tsError = (root: string, sep = "/") =>
    `Could not find a declaration file for module 'expo-foo/app.plugin'. '${root}${sep}node_modules${sep}expo-foo${sep}app.plugin.js' implicitly has an 'any' type.   Try \`npm i --save-dev @types/expo-foo\` if it exists or add a new declaration (.d.ts) file containing \`declare module 'expo-foo/app.plugin';\``;

describe("normalizeErrorPaths", () => {
    it("produces the same message for a CI checkout and a local one", () => {
        const ci = normalizeErrorPaths(tsError("/home/runner/work/typed-config-plugins/typed-config-plugins"));
        const local = normalizeErrorPaths(tsError("/Users/someone/dev/typed-config-plugins"));

        expect(ci).toBe(local);
        expect(ci).toContain("'node_modules/expo-foo/app.plugin.js'");
    });

    it("produces the same message on Windows as on posix", () => {
        expect(normalizeErrorPaths(tsError("C:\\Users\\someone\\dev\\typed-config-plugins", "\\"))).toBe(normalizeErrorPaths(tsError("/home/runner/work/typed-config-plugins/typed-config-plugins")));
    });

    it("keeps the module specifier and the rest of the message untouched", () => {
        expect(normalizeErrorPaths(tsError("/home/runner/work/typed-config-plugins/typed-config-plugins"))).toBe(
            "Could not find a declaration file for module 'expo-foo/app.plugin'. 'node_modules/expo-foo/app.plugin.js' implicitly has an 'any' type.   Try `npm i --save-dev @types/expo-foo` if it exists or add a new declaration (.d.ts) file containing `declare module 'expo-foo/app.plugin';`",
        );
    });

    it("makes paths inside the repo (but outside node_modules) relative to the project root", () => {
        expect(normalizeErrorPaths(`'${process.cwd()}/src/plugin/pluginTypes.ts' is not a module`)).toBe("'src/plugin/pluginTypes.ts' is not a module");
    });

    it("reduces a path outside the repo to its file name, since its directory is machine-specific", () => {
        expect(normalizeErrorPaths("Cannot read '/opt/hostedtoolcache/node/lib/lib.es2020.d.ts'")).toBe("Cannot read 'lib.es2020.d.ts'");
    });

    it("keeps a nested node_modules path anchored on the innermost node_modules", () => {
        expect(normalizeErrorPaths("'/repo/node_modules/a/node_modules/b/index.d.ts'")).toBe("'node_modules/b/index.d.ts'");
    });

    it("leaves messages without absolute paths alone", () => {
        const message = "Property 'default' does not exist on type 'typeof import(\"expo-foo/app.plugin\")'";
        expect(normalizeErrorPaths(message)).toBe(message);
    });

    it("is idempotent, so a second pipeline run never rewrites an already-stored error", () => {
        const once = normalizeErrorPaths(tsError("/home/runner/work/typed-config-plugins/typed-config-plugins"));
        expect(normalizeErrorPaths(once)).toBe(once);
    });
});
