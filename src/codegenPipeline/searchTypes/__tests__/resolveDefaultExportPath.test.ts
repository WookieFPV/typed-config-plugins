import { describe, expect, it } from "bun:test";
import { findModuleImplementation } from "../resolveDefaultExportPath";

describe("findModuleImplementation", () => {
    it("should find implementation for react-native-permissions package", async () => {
        const result = await findModuleImplementation("react-native-permissions");

        // Verify the result points to the correct file
        expect(result).toBe("react-native-permissions/dist/commonjs/expo");
        // The types are here: react-native-permissions/dist/typescript/expo
        // But it`s impossible to find that file from the code, because its not referenced anywhere
    });

    it("should find implementation for expo-notifications package", async () => {
        const result = await findModuleImplementation("expo-notifications");

        // Verify the result points to the correct file
        expect(result).toBe("expo-notifications/plugin/build/withNotifications");
    });
});
