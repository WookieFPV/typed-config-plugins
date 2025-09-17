import { describe, it } from "bun:test";
import { plugin } from "../plugin/plugin";

describe("plugin", () => {
    it("packages without overrides", () => {
        plugin("expo-build-properties", { ios: { ccacheEnabled: false } });
        // @ts-expect-error this should fail
        plugin("expo-build-properties", { ios: { ccacheEnabled22: false } });

        plugin("react-native-ble-manager", { neverForLocation: true });
        // @ts-expect-error this should fail
        plugin("react-native-ble-manager", { neverForLocation222: true });

        // @ts-expect-error this should fail
        plugin("react-native-ble-manager", { neverForLocation: "wrong" });

        plugin("expo-build-properties", {});
        plugin("instabug-reactnative", {});
    });

    it("should work with path override", () => {
        plugin("instabug-reactnative", { addBugReportingIosMediaPermission: true });

        // @ts-expect-error this should fail
        plugin("instabug-reactnative", { foo: true });
    });
});
