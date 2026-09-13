import type { RestEndpointMethodTypes } from "@octokit/rest";
import { cleanupGitHubUrl } from "./cleanupGitHubUrl";
import type { GitHubPersistItem } from "./gitHubRepoList";

export type GitHubItems = RestEndpointMethodTypes["search"]["code"]["response"]["data"]["items"];
export type GitHubItem = GitHubItems[number];

/**
 * input:  https://github.com/expo/expo/blob/31c016792bf5b2dc5bcea2021527fd59c1f7076e/packages/expo-maps/app.plugin.js
 * output: https://github.com/expo/expo/packages/expo-maps
 */
export const fixRepoUrl = (url: string) =>
    cleanupGitHubUrl(
        url
            // remove /blob/[UUID] from URI, and /app.plugin.js from the end
            .replace(/\/blob\/[a-f0-9]{40}\/app\.plugin\.js$/, "")
            .replace(/\/blob\/[a-f0-9]{40}/, "/tree/main")
            .replace(/\/app\.plugin\.js$/, ""),
    );

export const GitHubPersistorMapper = (i: GitHubItem): GitHubPersistItem => ({
    githubUrl: fixRepoUrl(i.html_url),
    npmPkgRaw: i.repository.full_name,
    origin: "gitHub",
});
