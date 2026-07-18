import { describe, expect, it } from "bun:test";
import path from "node:path";
import { verifyExportType } from "../verifyExportType";

// Fixtures are addressed relative to `src/plugin/`, since that's where the real generated
// file (and the checker's virtual file) lives - matching real module resolution exactly.
const fixture = (name: string) => path.relative(path.join(process.cwd(), "src", "plugin"), path.join(import.meta.dir, "fixtures", name));

describe("verifyExportType", () => {
    it("passes when the module has a matching default export", () => {
        expect(verifyExportType(fixture("validDefault"), "default")).toEqual({ valid: true });
    });

    it("fails when the module has no exports at all (e.g. an empty generated .d.ts)", () => {
        const result = verifyExportType(fixture("emptyExport"), "default");
        expect(result.valid).toBe(false);
        expect(result.valid === false && result.moduleNotFound).toBe(false);
    });

    it("fails when the module only ships a named export instead of a default one", () => {
        const result = verifyExportType(fixture("namedExportOnly"), "default");
        expect(result.valid).toBe(false);
    });

    it("passes when checking the export name the module actually has", () => {
        expect(verifyExportType(fixture("namedExportOnly"), "withThing")).toEqual({ valid: true });
    });

    it("fails for a module path that doesn't resolve at all, flagged as moduleNotFound", () => {
        const result = verifyExportType(fixture("doesNotExist"), "default");
        expect(result.valid).toBe(false);
        expect(result.valid === false && result.moduleNotFound).toBe(true);
    });

    it("fails for a plain CommonJS module without a matching .d.ts (no esModuleInterop `.default`)", () => {
        const result = verifyExportType(fixture("cjsOnly"), "default");
        expect(result.valid).toBe(false);
    });
});
