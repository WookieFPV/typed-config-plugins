import { describe, expect, it } from "bun:test";
import path from "node:path";
import type { RnDepPersist } from "../../utils/types";
import { revalidate } from "../5b_revalidate_plugin_types";

// Reuses the verifyExportType fixtures - addressed relative to `src/plugin/`, matching real
// module resolution for the generated file.
const fixture = (name: string) => path.relative(path.join(process.cwd(), "src", "plugin"), path.join(process.cwd(), "src", "codegenPipeline", "searchTypes", "__tests__", "fixtures", name));

const baseDep = (types: RnDepPersist["types"]): RnDepPersist => ({
    githubUrl: "https://github.com/example/example",
    npmPkg: "example",
    hasConfigPlugin: true,
    types,
});

describe("revalidate", () => {
    it("keeps a previously-valid entry unchanged when the module can't be found (likely a flaky install)", () => {
        const dep = baseDep({ path: fixture("doesNotExist"), valid: true });
        expect(revalidate(dep)).toBe(dep);
    });

    it("downgrades a previously-valid entry to invalid on a confirmed shape mismatch", () => {
        const dep = baseDep({ path: fixture("emptyExport"), valid: true });
        const result = revalidate(dep);
        expect(result).not.toBe(dep);
        expect(result.types?.valid).toBe(false);
    });

    it("heals a previously-invalid entry back to valid once the export is fixed", () => {
        const dep = baseDep({ path: fixture("validDefault"), valid: false, error: "stale error" });
        const result = revalidate(dep);
        expect(result.types?.valid).toBe(true);
        expect(result.types?.error).toBeUndefined();
    });

    it("skips packages with an ignore override", () => {
        const dep = baseDep({ path: fixture("emptyExport"), valid: true, override: { ignore: true } });
        expect(revalidate(dep)).toBe(dep);
    });

    it("skips packages with a manually pinned valid override", () => {
        const dep = baseDep({ path: fixture("emptyExport"), valid: true, override: { valid: true } });
        expect(revalidate(dep)).toBe(dep);
    });

    it("leaves packages without a resolved path untouched", () => {
        const dep = baseDep({ path: undefined as unknown as string, valid: false });
        expect(revalidate(dep)).toBe(dep);
    });

    it("keeps an already-invalid entry's error message unchanged when the module can't be found (likely a flaky install)", () => {
        const dep = baseDep({ path: fixture("doesNotExist"), valid: false, error: "stale error from a real mismatch" });
        expect(revalidate(dep)).toBe(dep);
    });

    it("validates the override path instead of the recorded path when one is set", () => {
        const dep = baseDep({ path: fixture("emptyExport"), override: { path: fixture("validDefault") }, valid: false, error: "stale error" });
        const result = revalidate(dep);
        expect(result.types?.valid).toBe(true);
        expect(result.types?.error).toBeUndefined();
    });
});
