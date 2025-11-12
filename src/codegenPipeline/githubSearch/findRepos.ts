import { RequestError } from "@octokit/request-error";
import { Octokit } from "@octokit/rest";
import { flow } from "es-toolkit";
import { sortBy, uniqBy } from "es-toolkit/array";
import pMap from "p-map";
import { mapGetNpmPkg } from "../npmRegistry/mapGetNpmPkg";
import { type GitHubPersistItem, gitHubRepoList } from "./gitHubRepoList";
import { type GitHubItems, GitHubPersistorMapper } from "./helper";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const searchQuery = 'filename:"app.plugin.js"'; // Use filename search for exact matches in any directory
const perPage = 100; // Max per page for search API

const cleanupRepoItems = flow(
    (items: GitHubItems) => items.filter((i) => i.html_url.endsWith("/app.plugin.js")),
    (items) => uniqBy(items, (item) => item.repository.html_url),
    (items) => items.map(GitHubPersistorMapper),
    (items) => items.filter((i) => !i.githubUrl.includes("/node_modules")),
    (items) => sortBy(items, ["githubUrl"]),
);

async function searchForPluginFile() {
    let page = 1;

    try {
        while (true) {
            console.log(`Searching page ${page} for query: ${searchQuery}`);
            const response = await octokit.search.code({
                q: searchQuery,
                per_page: perPage,
                page: page,
            });
            const allRepositories = response.data.items;
            if (allRepositories.length === 0 || allRepositories.length < perPage) break; // Last page of results
            if (page * perPage >= 1000) {
                console.warn(`WARNING: GitHub API only returns up to 1,000 results per query. Results may be truncated for query: ${searchQuery}`);
                break;
            }

            const filtered = cleanupRepoItems(allRepositories);
            console.log(`[page] Add ${filtered.length}/${allRepositories.length} repositories`);
            await gitHubRepoList.update(filtered);
            console.log(`Wrote ${allRepositories.length} to ${gitHubRepoList.path}`);
            page++;
        }
        const deps = await gitHubRepoList.load("withoutNpmPkg");
        const fulfilled = await pMap(deps, mapGetNpmPkg, { concurrency: 20 });
        await gitHubRepoList.update(fulfilled as unknown as GitHubPersistItem[], { override: true });

        const allDeps = await gitHubRepoList.load();
        const uniqAllDeps = uniqBy(allDeps, (pkg) => pkg.npmPkg);
        await gitHubRepoList.save(uniqAllDeps as unknown as GitHubPersistItem[]);
    } catch (error) {
        if (error instanceof Error) console.error("Error searching for repositories:", error.message);
        if (error instanceof RequestError && error.status === 403 && error.response?.headers["x-ratelimit-remaining"] === "0") {
            console.error("You've hit the GitHub API rate limit. Please try again later or provide an authentication token.");
        }
    }
}

await searchForPluginFile();
