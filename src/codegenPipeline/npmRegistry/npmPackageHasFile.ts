import { type FileProbeResult, probeFile } from "../utils/probeFile";
import { npmQueue } from "./npmQueue";

// jsdelivr serves files straight out of the published npm tarball, keyed by package name (it
// resolves to the latest version when none is given) - a HEAD request tells us whether a file
// exists in the published package without ever transferring its contents.
export const npmFileUrl = (npmPkg: string, fileName: string): string => `https://cdn.jsdelivr.net/npm/${npmPkg}/${fileName}`;

// jsdelivr refuses to serve files out of a git repo larger than 150MB, surfaced as a 403 on an
// otherwise-valid package/file - that's not transient (retrying won't help) and not "file missing"
// either, so callers need to tell it apart to fall back to the GitHub API instead.
export const JSDELIVR_REPO_TOO_LARGE = "jsdelivr: repo exceeds 150MB size limit";

export const npmPackageHasFile = async (npmPkg: string, fileName: string, retries = 3): Promise<FileProbeResult> =>
    npmQueue.add(() =>
        probeFile(
            npmFileUrl(npmPkg, fileName),
            ({ status, statusText }) => {
                if (status === 200) return true;
                if (status === 404) return false;
                if (status === 403) return JSDELIVR_REPO_TOO_LARGE;
                if (status === 429 || status >= 500) return undefined; // transient - retry
                return statusText;
            },
            { init: { method: "HEAD" }, retries },
        ),
    );
