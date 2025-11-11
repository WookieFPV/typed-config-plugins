import { describe, expect, it } from "bun:test";
import { packageListFile } from "../storage/mainPackageList";
import type { ConfigPluginOverrides, RnDep, RnDepPersist } from "../utils/types";

const validKeys: Array<keyof RnDepPersist> = ["npmPkg", "githubUrl", "hasConfigPlugin", "types", "origin", "unmaintained"];
const validTypeKeys: Array<keyof Exclude<RnDep["types"], undefined>> = ["path", "override", "error", "valid", "packageExport"];
const validTypeOverrideKeys: Array<keyof ConfigPluginOverrides> = ["path", "ignore", "alias", "name", "valid"];

const isValid = (dep: RnDep) => {
    Object.entries(dep).forEach(([key]) => {
        expect(key, `${dep.npmPkg} dep valid Keys: ${key}`).toBeOneOf(validKeys);
    });

    Object.entries(dep.types ?? {}).forEach(([key]) => {
        expect(key, `${dep.npmPkg} dep.types valid Keys: ${key}`).toBeOneOf(validTypeKeys);
    });

    Object.entries(dep.types?.override ?? {}).forEach(([key]) => {
        expect(key, `${dep.npmPkg} dep.types?.override valid Key: ${key}`).toBeOneOf(validTypeOverrideKeys);
    });
};

describe("validateDeps", () => {
    it("should only contain know keys", async () => {
        const deps = await packageListFile.load("unignored");

        for (const dep of deps) {
            isValid(dep);
        }
    });
});
