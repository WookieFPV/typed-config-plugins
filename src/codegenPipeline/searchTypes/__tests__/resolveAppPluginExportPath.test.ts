import { describe, expect, it } from "bun:test";
import { computePackageExportFlag } from "../computePackageExportFlag";
import { resolveAppPluginExportPath } from "../resolveAppPluginExportPath";

describe("resolveAppPluginExportPath", () => {
    it("prefers the extension-less `app.plugin` key when the package exposes one", () => {
        // expo-beacon's `exports` map declares both `./app.plugin` and `./app.plugin.js`.
        expect(resolveAppPluginExportPath("expo-beacon")).toEqual("expo-beacon/app.plugin");
    });

    it("falls back to the `.js` key when that's the only one declared", () => {
        // @react-native-firebase/app only declares `./app.plugin.js`, not the extension-less form.
        expect(resolveAppPluginExportPath("@react-native-firebase/app")).toEqual("@react-native-firebase/app/app.plugin.js");
    });

    it("returns undefined for a package without an `exports` map", () => {
        expect(resolveAppPluginExportPath("react-native-app-auth")).toBeUndefined();
    });
});

describe("computePackageExportFlag", () => {
    it("is undefined when the resolved path is the package's own declared app.plugin export", () => {
        expect(computePackageExportFlag("@react-native-firebase/app", "@react-native-firebase/app/app.plugin.js")).toBeUndefined();
    });

    it("is true when the resolved path reaches past the app.plugin export into package internals", () => {
        expect(computePackageExportFlag("@react-native-firebase/app", "@react-native-firebase/app/plugin/build/index")).toBe(true);
    });

    it("is undefined for a package without an `exports` map, regardless of path", () => {
        expect(computePackageExportFlag("react-native-app-auth", "react-native-app-auth/plugin/build/index")).toBeUndefined();
    });
});
