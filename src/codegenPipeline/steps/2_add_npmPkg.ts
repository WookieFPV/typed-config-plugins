import { isPackageNotUnmaintained } from "../utils/filterPackages";
import { fetchNpmPackageName, gitHubQueue } from "../utils/gitHub";
import { groupPromiseAllSettled } from "../utils/groupPromiseAllSettled";
import { stepLogger } from "../utils/logger";
import { packageListFile, updatePluginsListFile } from "../utils/packageListJson";
import type { RnDep } from "../utils/types";

const { logger } = stepLogger("Adding NPM package names");

export const addNpmPackageName = async () => {
    logger.start();
    const packages = await packageListFile().load();

    const { npm = [], unknown = [], ignored = [] } = Object.groupBy(packages, (p) => ("npmPkg" in p ? "npm" : p.ignore ? "ignored" : "unknown"));

    if (unknown.length) logger.log(`Packages without known npm package [${unknown.length}/${unknown.length + npm.length + ignored.length}]`);

    if (unknown.length > 0 && !process.env.GITHUB_TOKEN) {
        logger.warn("Not GitHub Token set, aborting...\n");
        process.exit(1);
    }

    let i = 0;
    const _enrichedPackages = await Promise.allSettled(
        unknown.map(
            (dep) =>
                gitHubQueue.add(async (): Promise<RnDep> => {
                    logger.progressText(`Adding NPM package names [${i++}/${unknown.length}]`);
                    return {
                        ...dep,
                        npmPkg: await fetchNpmPackageName(dep.githubUrl),
                    };
                }) as Promise<RnDep>,
        ),
    );
    const { fulfilled, rejected } = groupPromiseAllSettled(unknown, _enrichedPackages);

    await updatePluginsListFile(fulfilled);

    const rejectedAndMaintained = rejected.filter(({ input }) => isPackageNotUnmaintained(input));
    if (rejectedAndMaintained.length > 0) {
        logger.warn("Failed to get npm package name:");
        for (const { input, reason } of rejectedAndMaintained) {
            logger.log(`- ${input.githubUrl}: ${reason.message}`);
        }
    }
    logger.finish();
};
