import { describe, expect, it } from "bun:test";
import { cleanupUrl } from "../cleanupUrl";

describe("cleanupUrl", () => {
    it("returns baseUrl only if only repo URL is given", () => {
        const url = "https://github.com/foo/bar";
        const [baseUrl, possiblePath] = cleanupUrl(url);

        expect(baseUrl).toBe("https://github.com/foo/bar");
        expect(possiblePath).toBeUndefined();
    });

    it("cleans up a tree/develop reference into correct baseUrl + path", () => {
        const url = "https://github.com/foo/bar/tree/develop/package/native-package";
        const [baseUrl, possiblePath] = cleanupUrl(url);

        expect(baseUrl).toBe("https://github.com/foo/bar");
        expect(possiblePath).toBe("package/native-package/");
    });

    it("returns trailing slash in possiblePath", () => {
        const url = "https://github.com/foo/bar/tree/main/src/utils";
        const [baseUrl, possiblePath] = cleanupUrl(url);

        expect(baseUrl).toBe("https://github.com/foo/bar");
        expect(possiblePath).toBe("src/utils/");
    });

    it("handles branch with dash or special chars", () => {
        const url = "https://github.com/foo/bar/tree/feature/awesome-feature/src";
        const [baseUrl, possiblePath] = cleanupUrl(url);

        expect(baseUrl).toBe("https://github.com/foo/bar");
        expect(possiblePath).toBe("awesome-feature/src/");
    });

    it("works with deeply nested paths", () => {
        const url = "https://github.com/foo/bar/tree/develop/packages/app/src/components/Button";
        const [baseUrl, possiblePath] = cleanupUrl(url);

        expect(baseUrl).toBe("https://github.com/foo/bar");
        expect(possiblePath).toBe("packages/app/src/components/Button/");
    });

    it("returns only baseUrl if URL has no tree/branch segment but extra slash at end", () => {
        const url = "https://github.com/foo/bar/";
        const [baseUrl, possiblePath] = cleanupUrl(url);

        expect(baseUrl).toBe("https://github.com/foo/bar");
        expect(possiblePath).toBeUndefined();
    });
});
