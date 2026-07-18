import { delay } from "es-toolkit/promise";
import { npmQueue } from "./npmQueue";

// jsdelivr serves files straight out of the published npm tarball, keyed by package name (it
// resolves to the latest version when none is given) - a HEAD request tells us whether a file
// exists in the published package without ever transferring its contents.
export const npmFileUrl = (npmPkg: string, fileName: string): string => `https://cdn.jsdelivr.net/npm/${npmPkg}/${fileName}`;

// jsdelivr refuses to serve files out of a git repo larger than 150MB, surfaced as a 403 on an
// otherwise-valid package/file - that's not transient (retrying won't help) and not "file missing"
// either, so callers need to tell it apart to fall back to the GitHub API instead.
export const JSDELIVR_REPO_TOO_LARGE = "jsdelivr: repo exceeds 150MB size limit";

const isTransientStatus = (status: number) => status === 429 || status >= 500;

export const npmPackageHasFile = async (
    npmPkg: string,
    fileName: string,
    retries = 3,
): Promise<{
    hasFile: boolean | string;
    url: string;
}> => {
    const url = npmFileUrl(npmPkg, fileName);

    return npmQueue.add(async () => {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, { method: "HEAD" });
                if (response.status === 200) return { hasFile: true, url };
                if (response.status === 404) return { hasFile: false, url };
                if (response.status === 403) return { hasFile: JSDELIVR_REPO_TOO_LARGE, url };
                if (attempt < retries && isTransientStatus(response.status)) {
                    await delay(2 ** attempt * 500);
                    continue;
                }
                return { hasFile: response.statusText, url };
            } catch (error) {
                // `fetch` itself can throw (DNS failure, timeout, connection reset) rather than
                // resolving to a response - treat that the same as a transient status instead of
                // letting it escape and reject the whole concurrency batch this call is part of.
                const message = error instanceof Error ? error.message : String(error);
                if (attempt < retries) {
                    await delay(2 ** attempt * 500);
                    continue;
                }
                return { hasFile: `fetch failed: ${message}`, url };
            }
        }
        // unreachable, satisfies TS
        return { hasFile: "unknown", url };
    });
};
