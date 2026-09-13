const githubUrlSegmentCount = "https://github.com/foo/bar".split("/").length;

/**
 * (dirty & hacky) cleanup of GitHub urls
 * from:
 * https://github.com/foo/bar/tree/develop/package/native-package
 * to:
 * baseUrl: https://github.com/foo/bar
 * possiblePath: package/native-package/
 */
export const cleanupUrl = (url: string): [baseUrl: string, possiblePath: string | undefined] => {
    const segments = url.split("/");
    if (segments.length === githubUrlSegmentCount) return [url, undefined];

    const baseUrl = segments.slice(0, githubUrlSegmentCount).join("/");
    // Skips the `/tree/<branch>` segments that follow the repo URL.
    const possiblePath = segments.slice(githubUrlSegmentCount + 2).join("/");
    return [baseUrl, possiblePath ? `${possiblePath}/` : undefined];
};
