import { describe, expect, it } from "bun:test";
import { plugin } from "../plugin/plugin";

describe("plugin", () => {
    it("packages without overrides", () => {
        plugin("expo-build-properties", { ios: { ccacheEnabled: false } });
        // @ts-expect-error this should fail
        plugin("expo-build-properties", { ios: { ccacheEnabled22: false } });
        plugin("expo-build-properties", {});

        plugin("react-native-ble-manager", { neverForLocation: true });
        // @ts-expect-error this should fail
        plugin("react-native-ble-manager", { neverForLocation222: true });

        // @ts-expect-error this should fail
        plugin("react-native-ble-manager", { neverForLocation: "wrong" });
    });

    it("should work with path override", () => {
        plugin("instabug-reactnative", { addBugReportingIosMediaPermission: true });
        plugin("instabug-reactnative", {});
        // @ts-expect-error this should fail
        plugin("instabug-reactnative", { foo: true });
    });

    it("expo-color-space-plugin", () => {
        plugin("expo-color-space-plugin", { colorSpace: "SRGB" });
        expect(plugin("expo-color-space-plugin", { colorSpace: "displayP3" })).toEqual(["expo-color-space-plugin", { colorSpace: "displayP3" }]);

        expect(plugin("expo-color-space-plugin")).toEqual(["expo-color-space-plugin"]);

        // @ts-expect-error this should fail
        expect(plugin("expo-color-space-plugin", { foo: true }).toEqual(["expo-color-space-plugin", { foo: true }]));
    });
});
