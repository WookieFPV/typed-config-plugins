import { describe, expect, it } from "bun:test";
import path from "node:path";
import type { RnDepPersist } from "../../utils/types";
import { checkValidity } from "../5_find_plugin_types";

// Reuses the verifyExportType fixtures - addressed relative to `src/plugin/`, matching real
// module resolution for the generated file.
const fixture = (name: string) => path.relative(path.join(process.cwd(), "src", "plugin"), path.join(process.cwd(), "src", "codegenPipeline", "searchTypes", "__tests__", "fixtures", name));

const baseDep = (types: RnDepPersist["types"]): RnDepPersist => ({
    githubUrl: "https://github.com/example/example",
    npmPkg: "example",
    hasConfigPlugin: true,
    types,
});

describe("checkValidity", () => {
    it("validates the auto-discovered path when there is no override", () => {
        expect(checkValidity(baseDep(undefined), fixture("validDefault"))).toEqual({ valid: true });
    });

    it("respects a manually pinned override.valid without touching the type checker", () => {
        expect(checkValidity(baseDep({ path: "", valid: false, override: { valid: true } }), fixture("emptyExport"))).toEqual({ valid: true });
    });

    it("validates override.path instead of the auto-discovered path when one is set", () => {
        // The auto-discovered path is broken, but the override path is valid - codegen emits the
        // override path, so that's what must determine validity.
        const dep = baseDep({ path: "", valid: false, override: { path: fixture("validDefault") } });
        expect(checkValidity(dep, fixture("emptyExport"))).toEqual({ valid: true });
    });

    it("flags an override.path that is itself broken, even if the auto-discovered path is fine", () => {
        const dep = baseDep({ path: "", valid: false, override: { path: fixture("emptyExport") } });
        const result = checkValidity(dep, fixture("validDefault"));
        expect(result.valid).toBe(false);
    });
});
