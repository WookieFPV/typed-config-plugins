const githubUrlSlashCount = "https://github.com/foo/bar".split("/").length;

/**
 * (dirty & hacky) cleanup of GitHub urls
 * from:
 * https://github.com/foo/bar/tree/develop/package/native-package
 * to:
 * baseUrl: https://github.com/foo/bar
 * possiblePath: package/native-package/
 */
export const cleanupUrl = (url: string): [string, string | undefined] => {
    if (url.split("/").length === githubUrlSlashCount) return [url, undefined];

    const baseUrl = url.split("/").slice(0, githubUrlSlashCount).join("/");
    const possiblePath = url
        .split("/")
        .slice(githubUrlSlashCount + 2)
        .join("/");
    return [baseUrl, possiblePath ? `${possiblePath}/` : undefined];
};
