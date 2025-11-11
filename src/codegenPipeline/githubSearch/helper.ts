import type { RestEndpointMethodTypes } from "@octokit/rest";
import { cleanupGitHubUrl } from "./cleanupGitHubUrl";
import type { GitHubPersistItem } from "./gitHubRepoList";

export type GitHubItems = RestEndpointMethodTypes["search"]["code"]["response"]["data"]["items"];
export type GitHubItem = GitHubItems[number];

export const fixRepoUrl = (url: string) => {
    // input https://github.com/expo/expo/blob/31c016792bf5b2dc5bcea2021527fd59c1f7076e/packages/expo-maps/app.plugin.js
    // output https://github.com/expo/expo/packages/expo-maps

    // remove /blob/[UUID] from URI
    // remove /app.plugin.js from URI at end
    return cleanupGitHubUrl(
        url
            .replace(/\/blob\/[a-f0-9]{40}\/app\.plugin\.js$/, "")
            .replace(/\/blob\/[a-f0-9]{40}/, "/tree/main")
            .replace(/\/app\.plugin\.js$/, ""),
    );
};

export const GitHubPersistorMapper = (i: GitHubItem): GitHubPersistItem => ({
    githubUrl: cleanupGitHubUrl(fixRepoUrl(i.html_url)),
    npmPkgRaw: i.repository.full_name,
    origin: "gitHub",
});
