import { describe, expect, it } from "bun:test";
import { findBestConfigPluginTypePath } from "../findConfigPluginTypePath";
import { findBestConfigPluginTypePathCombined } from "../findPluginTypePathCombined";
import { findModuleImplementation } from "../resolveDefaultExportPath";

describe("typeDetection", () => {
    describe("findModuleImplementation", () => {
        it("resolve react-native-app-auth", () => {
            expect(findModuleImplementation("react-native-app-auth")).resolves.toEqual("react-native-app-auth/plugin/build/index");
        });

        it.failing("resolve react-native-bootsplash", () => {
            expect(findModuleImplementation("react-native-bootsplash")).resolves.toEqual("react-native-bootsplash/dist/typescript/expo");
        });
    });

    describe("findBestConfigPluginTypePath", () => {
        it("resolve react-native-app-auth", () => {
            expect(findBestConfigPluginTypePath("react-native-app-auth")).resolves.toBeOneOf(["react-native-app-auth/plugin/build/index", "react-native-app-auth/plugin/build/types.d.ts"]);
        });

        it("resolve react-native-bootsplash", () => {
            expect(findBestConfigPluginTypePath("react-native-bootsplash")).resolves.toBeOneOf(["react-native-bootsplash/dist/typescript/expo", "react-native-bootsplash/dist/typescript/expo.d.ts"]);
        });
    });

    describe("findBestConfigPluginTypePathCombined", () => {
        it("resolve react-native-app-auth", () => {
            expect(findBestConfigPluginTypePathCombined("react-native-app-auth")).resolves.toEqual("react-native-app-auth/plugin/build/index");
        });

        it("resolve react-native-bootsplash", () => {
            expect(findBestConfigPluginTypePathCombined("react-native-bootsplash")).resolves.toEqual("react-native-bootsplash/dist/typescript/expo");
        });

        it("@survicate/react-native-survicate", () => {
            expect(findBestConfigPluginTypePathCombined("@survicate/react-native-survicate")).resolves.toEqual("@survicate/react-native-survicate/lib/typescript/expo/withSurvicate");
        });

        it("react-native-capture-protection", () => {
            expect(findBestConfigPluginTypePathCombined("react-native-capture-protection")).resolves.toEqual("react-native-capture-protection/plugins/withPlugin");
        });
    });
});
