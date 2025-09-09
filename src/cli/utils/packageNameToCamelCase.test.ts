// filepath: /Users/lmueller/os/list-config-plugins/__tests__/packageNameToCamelCase.test.ts
import { describe, expect, it } from "bun:test";
import { packageNameToCamelCase } from "./packageNameToCamelCase";

describe("packageNameToCamelCase", () => {
    it("should convert regular package names with hyphens", () => {
        expect(packageNameToCamelCase("react-dom")).toBe("reactDom");
    });

    it("should convert scoped package names", () => {
        expect(packageNameToCamelCase("@angular/core")).toBe("angularCore");
    });

    it("should convert package names with dots", () => {
        expect(packageNameToCamelCase("lodash.get")).toBe("lodashGet");
    });

    it("should convert complex scoped package names with multiple segments", () => {
        expect(packageNameToCamelCase("@react-native-firebase/app")).toBe("reactNativeFirebaseApp");
    });

    it("should handle single-word package names", () => {
        expect(packageNameToCamelCase("express")).toBe("express");
    });

    it("should handle package names with multiple hyphens", () => {
        expect(packageNameToCamelCase("some-very-long-package-name")).toBe("someVeryLongPackageName");
    });

    it("should handle package names with mixed separators", () => {
        expect(packageNameToCamelCase("@scope/component.with-mixed.separators")).toBe(
            "scopeComponentWithMixedSeparators",
        );
    });
});
