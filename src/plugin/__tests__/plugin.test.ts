import { describe, expect, it } from "bun:test";
import { plugin } from "../plugin";

describe("plugin", () => {
    describe("without overrides", () => {
        describe("expo-build-properties", () => {
            plugin("expo-build-properties", { ios: { ccacheEnabled: false } });

            plugin("expo-build-properties");
            plugin("expo-build-properties", {});

            // @ts-expect-error this should fail
            plugin("expo-build-properties", { ios: { ccacheEnabled22: false } });
        });

        describe("react-native-ble-manager", () => {
            plugin("react-native-ble-manager");
            plugin("react-native-ble-manager", { neverForLocation: true });

            // @ts-expect-error this should fail
            plugin("react-native-ble-manager", { invalidProperty: true });

            // @ts-expect-error this should fail
            plugin("react-native-ble-manager", { neverForLocation: "wrong" });
        });

        describe("react-native-bootsplash", () => {
            plugin("react-native-bootsplash");
            plugin("react-native-bootsplash", {});

            // @ts-expect-error this should fail
            plugin("react-native-bootsplash", { invalidProperty: true });

            // @ts-expect-error this should fail
            plugin("react-native-bootsplash", { neverForLocation: "wrong" });
        });

        describe("@bitdrift/react-native", () => {
            plugin("@bitdrift/react-native");
            plugin("@bitdrift/react-native", { networkInstrumentation: true });

            // @ts-expect-error this should fail
            plugin("@bitdrift/react-native", { foo: true });

            // @ts-expect-error this should fail
            plugin("@bitdrift/react-native", { networkInstrumentation: 1 });
        });

        describe("@stripe/stripe-react-native", () => {
            plugin("@stripe/stripe-react-native");
            plugin("@stripe/stripe-react-native", { merchantIdentifier: "", enableGooglePay: true });
            // @ts-expect-error this should fail
            plugin("@stripe/stripe-react-native", {}); // mandatory properties

            // @ts-expect-error this should fail
            plugin("@stripe/stripe-react-native", { invalidProperty: true });

            // @ts-expect-error this should fail
            plugin("@stripe/stripe-react-native", { merchantIdentifier: "", enableGooglePay: "example" });
        });
    });

    describe("override", () => {
        describe("instabug-reactnative", () => {
            plugin("instabug-reactnative", { addBugReportingIosMediaPermission: true });
            plugin("instabug-reactnative", { forceUploadSourceMaps: false });
            plugin("instabug-reactnative");

            // @ts-expect-error this should fail
            plugin("instabug-reactnative", { foo: true });
        });
    });

    describe("without app.plugin.js file", () => {
        it("expo-color-space-plugin", () => {
            plugin("expo-color-space-plugin", { colorSpace: "SRGB" });
            plugin("expo-color-space-plugin");
            expect(plugin("expo-color-space-plugin", { colorSpace: "displayP3" })).toEqual(["expo-color-space-plugin", { colorSpace: "displayP3" }]);
            expect(plugin("expo-color-space-plugin")).toEqual(["expo-color-space-plugin"]);

            // @ts-expect-error this should fail
            expect(plugin("expo-color-space-plugin", { foo: true })).toEqual(["expo-color-space-plugin", { foo: true }]);
        });
    });

    describe("with alias", () => {
        it("sentry", () => {
            plugin("@sentry/react-native");
            plugin("@sentry/react-native/expo");

            plugin("@sentry/react-native", { project: "foo" });
            expect(plugin("@sentry/react-native/expo", { project: "foo" })).toEqual(["@sentry/react-native/expo", { project: "foo" }]);

            // @ts-expect-error this should fail
            plugin("@sentry/react-native", { project: 42 });
            // @ts-expect-error this should fail
            plugin("@sentry/react-native/expo", { project: 42 });
        });
    });
});
