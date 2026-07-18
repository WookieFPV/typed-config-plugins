import { delay } from "es-toolkit/promise";
import { cleanupUrl } from "./cleanupUrl";

export const githubHeaders = () => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN is not set");
    const headers: Record<string, string> = {};

    headers.Authorization = `Bearer ${token}`;
    return { headers };
};

const token = process.env.GITHUB_TOKEN;
export const apiUrl = (githubUrl: string, fileName: string, path: string | undefined = ""): string => {
    return `${githubUrl.replace("github.com", "api.github.com/repos")}/contents/${path}${fileName}`;
};
// GitHub occasionally answers a valid, authenticated request with a transient
// 401/403/5xx (e.g. under concurrent load against the same repo) instead of the
// real 200/404 result. Retrying those (but not a real 404) avoids permanently
// recording an incorrect "no config plugin" for the package.
const isTransientStatus = (status: number) => status === 401 || status === 403 || status === 429 || status >= 500;

export const repoHasFile = async (
    githubUrl: string,
    fileName: string,
    path: string | undefined,
    retries = 3,
): Promise<{
    hasConfigPlugin: boolean | string;
    url: string;
}> => {
    if (!token) throw new Error("GITHUB_TOKEN is not set");
    const url = apiUrl(githubUrl, fileName, path);

    // fetch GitHub to check if a file app.plugin.js  at the root of the repo exists
    const headers: Record<string, string> = {};

    headers.Authorization = `Bearer ${token}`;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, { headers });
            if (response.status === 200) return { hasConfigPlugin: true, url };
            if (response.status === 404) return { hasConfigPlugin: false, url };
            if (attempt < retries && isTransientStatus(response.status)) {
                await delay(2 ** attempt * 500);
                continue;
            }
            return { hasConfigPlugin: response.statusText, url };
        } catch (error) {
            // `fetch` itself can throw (DNS failure, timeout, connection reset) rather than
            // resolving to a response - treat that the same as a transient status instead of
            // letting it escape and reject the whole concurrency batch this call is part of.
            const message = error instanceof Error ? error.message : String(error);
            if (attempt < retries) {
                await delay(2 ** attempt * 500);
                continue;
            }
            return { hasConfigPlugin: `fetch failed: ${message}`, url };
        }
    }
    // unreachable, satisfies TS
    return { hasConfigPlugin: "unknown", url };
};

export const fetchNpmPackageName = async (githubRepoUrl: string): Promise<string> => {
    const [base, path] = cleanupUrl(githubRepoUrl);

    // GitHub API endpoint for package.json
    const url = apiUrl(base, "package.json", path);

    const res = await fetch(url, githubHeaders());
    if (!res.ok) {
        throw new Error(`Failed to fetch package.json: ${res.status} ${githubRepoUrl} ${url}`);
    }
    const data = (await res.json()) as { content?: string };
    if (!data.content) throw new Error("package.json not found in repo");
    // Decode base64 content
    const pkgJson = JSON.parse(Buffer.from(data.content, "base64").toString());
    if (!pkgJson.name) throw new Error("No name field in package.json");
    // console.log(githubRepoUrl, "->", pkgJson.name);
    return pkgJson.name;
};
