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
        expect(checkValidity(baseDep(undefined), fixture("validDefault"), undefined)).toEqual({ valid: true, exportName: "default" });
    });

    it("respects a manually pinned override.valid without touching the type checker", () => {
        expect(checkValidity(baseDep({ path: "", valid: false, override: { valid: true } }), fixture("emptyExport"), undefined)).toEqual({ valid: true, exportName: "default" });
    });

    it("validates override.path instead of the auto-discovered path when one is set", () => {
        // The auto-discovered path is broken, but the override path is valid - codegen emits the
        // override path, so that's what must determine validity.
        const dep = baseDep({ path: "", valid: false, override: { path: fixture("validDefault") } });
        expect(checkValidity(dep, fixture("emptyExport"), undefined)).toEqual({ valid: true, exportName: "default" });
    });

    it("flags an override.path that is itself broken, even if the auto-discovered path is fine", () => {
        const dep = baseDep({ path: "", valid: false, override: { path: fixture("emptyExport") } });
        const result = checkValidity(dep, fixture("validDefault"), undefined);
        expect(result.valid).toBe(false);
    });

    it("treats a moduleNotFound result as valid when the path reaches past the package's exports map", () => {
        // Mirrors the @react-native-firebase/* case: the recorded path was chosen specifically
        // because a matching `.d.ts` was found on disk, so a resolution failure here is expected
        // (exports-blocked), not a sign the type shape is actually wrong.
        const dep = baseDep({ path: "", valid: false });
        expect(checkValidity(dep, fixture("doesNotExist"), true)).toEqual({ valid: true, exportName: "default" });
    });

    it("still flags a genuine shape mismatch even when packageExport is true", () => {
        const dep = baseDep({ path: "", valid: false });
        const result = checkValidity(dep, fixture("emptyExport"), true);
        expect(result.valid).toBe(false);
    });

    it("retries against the bare module type for an `export =` plugin (no default export)", () => {
        const dep = baseDep({ path: "", valid: false });
        expect(checkValidity(dep, fixture("exportEquals"), undefined)).toEqual({ valid: true, exportName: "" });
    });

    it("does not retry the bare module type when a human pinned an explicit override.name", () => {
        const dep = baseDep({ path: "", valid: false, override: { name: "default" } });
        const result = checkValidity(dep, fixture("exportEquals"), undefined);
        expect(result.valid).toBe(false);
    });
});
