import { cleanupUrl } from "./cleanupUrl";
import { type FileProbeResult, probeFile } from "./probeFile";

export const githubHeaders = (): { headers: Record<string, string> } => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN is not set");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const apiUrl = (githubUrl: string, fileName: string, path: string | undefined = ""): string => {
    return `${githubUrl.replace("github.com", "api.github.com/repos")}/contents/${path}${fileName}`;
};

// GitHub occasionally answers a valid, authenticated request with a transient
// 401/403/5xx (e.g. under concurrent load against the same repo) instead of the
// real 200/404 result. Retrying those (but not a real 404) avoids permanently
// recording an incorrect "no config plugin" for the package.
const isTransientStatus = (status: number) => status === 401 || status === 403 || status === 429 || status >= 500;

// Fallback for `npmPackageHasFile` (jsdelivr) when the published package's git repo exceeds
// jsdelivr's 150MB size limit (surfaced as a 403) - checks the file directly in the GitHub repo
// instead. Slower and rate-limited, so it's only used as a last resort.
export const repoHasFile = async (githubUrl: string, fileName: string, path: string | undefined, retries = 3): Promise<FileProbeResult> => {
    const init = githubHeaders();
    const url = apiUrl(githubUrl, fileName, path);

    // A malformed `githubUrl` (e.g. not actually a github.com URL) makes `url` an invalid URL,
    // which `fetch` would reject deterministically on every attempt - fail fast instead of
    // burning retries/backoff on something retrying can never fix.
    if (!URL.canParse(url)) return { hasFile: `invalid URL: ${url}`, url };

    return probeFile(
        url,
        ({ status, statusText }) => {
            if (status === 200) return true;
            if (status === 404) return false;
            if (isTransientStatus(status)) return undefined; // transient - retry
            return statusText;
        },
        { init, retries },
    );
};

export const fetchNpmPackageName = async (githubRepoUrl: string): Promise<string> => {
    const [base, path] = cleanupUrl(githubRepoUrl);

    // GitHub API endpoint for package.json
    const url = apiUrl(base, "package.json", path);

    const res = await fetch(url, githubHeaders());
    if (!res.ok) throw new Error(`Failed to fetch package.json: ${res.status} ${githubRepoUrl} ${url}`);

    const data = (await res.json()) as { content?: string };
    if (!data.content) throw new Error("package.json not found in repo");
    // Decode base64 content
    const pkgJson = JSON.parse(Buffer.from(data.content, "base64").toString());
    if (!pkgJson.name) throw new Error("No name field in package.json");
    return pkgJson.name;
};
