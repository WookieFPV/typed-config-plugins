import pQueue from "p-queue";
import { cleanupUrl } from "./cleanupUrl";

export const githubHeaders = () => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN is not set");
    const headers: Record<string, string> = {};

    headers.Authorization = `Bearer ${token}`;
    return { headers };
};

export const gitHubQueue = new pQueue({
    concurrency: 20,
});

const token = process.env.GITHUB_TOKEN;
export const apiUrl = (githubUrl: string, fileName: string, path: string | undefined = ""): string => {
    return `${githubUrl.replace("github.com", "api.github.com/repos")}/contents/${path}${fileName}`;
};
export const repoHasFile = async (githubUrl: string, fileName: string, path: string | undefined): Promise<{ hasConfigPlugin: boolean | string; url: string }> => {
    if (!token) throw new Error("GITHUB_TOKEN is not set");
    const url = apiUrl(githubUrl, fileName, path);
    // fetch GitHub to check if a file app.plugin.js  at the root of the repo exists
    const headers: Record<string, string> = {};

    headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, { headers });
    const hasConfigPlugin = response.status === 200 ? true : response.status === 404 ? false : response.statusText;
    return { hasConfigPlugin, url };
};
export const fetchNpmPackageName = async (githubRepoUrl: string): Promise<string> => {
    const [base, path] = cleanupUrl(githubRepoUrl);

    // GitHub API endpoint for package.json
    const url = apiUrl(base, "package.json", path);

    const res = await fetch(url, githubHeaders());
    if (!res.ok) {
        // console.debug("###", url, res.status, res.statusText);
        throw new Error(`Failed to fetch package.json: ${res.status}`);
    }
    const data = (await res.json()) as { content?: string };
    if (!data.content) throw new Error("package.json not found in repo");
    // Decode base64 content
    const pkgJson = JSON.parse(Buffer.from(data.content, "base64").toString());
    if (!pkgJson.name) throw new Error("No name field in package.json");
    // console.log(githubRepoUrl, "->", pkgJson.name);
    return pkgJson.name;
};
