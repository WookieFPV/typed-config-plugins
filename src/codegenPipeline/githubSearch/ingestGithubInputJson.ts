import { toMerged } from "es-toolkit";
import { packageListFile } from "../storage/mainPackageList";
import { gitHubRepoList } from "./gitHubRepoList";

export const ingestGithubInputJson = async () => {
    const existingPackages = await packageListFile.load("withNpmPkg");
    const packagesGitHub = await gitHubRepoList.load();

    const gitHubPackages = packagesGitHub.map((i) =>
        toMerged(i, { origin: "gitHub" } as {
            origin: "gitHub";
            npmPkg: string; //TODO: fix fake npmPkg to satisfy our type
        }),
    );

    const dedupedPackages = gitHubPackages.filter((dep) => !existingPackages.find((p) => p.githubUrl === dep.githubUrl || p.npmPkg === dep.npmPkg));

    await packageListFile.update(dedupedPackages, { override: false });
};
