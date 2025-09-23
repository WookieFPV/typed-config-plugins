import { cleanupUrl } from "../utils/cleanupUrl";
import { gitHubQueue, repoHasFile } from "../utils/gitHub";
import { groupPromiseAllSettled } from "../utils/groupPromiseAllSettled";
import { stepLogger } from "../utils/logger";
import { packageListFile, updatePluginsListFile } from "../utils/packageListJson";
import type { RnDepFull } from "../utils/types";

const { logger } = stepLogger("Detecting Config Plugins");

export const detectConfigPlugins = async (type: "onlyNew" | "full" = "onlyNew"): Promise<Array<RnDepFull>> => {
    logger.start();
    const allPackages = await packageListFile().load();

    const packagesToCheck = allPackages.filter((p) => !p.ignore && "npmPkg" in p && (type === "full" || !("hasConfigPlugin" in p)));

    if (packagesToCheck.length > 0 && !process.env.GITHUB_TOKEN) {
        logger.warn("Not GitHub Token set, aborting...\n");
        process.exit(1);
    }

    let i = 0;
    const _processed = await Promise.allSettled(
        packagesToCheck.map(
            (dep) =>
                gitHubQueue.add(async () => {
                    const [baseUrl, path] = cleanupUrl(dep.githubUrl);
                    const { hasConfigPlugin } = await repoHasFile(baseUrl, "app.plugin.js", path);
                    if (typeof hasConfigPlugin !== "boolean") {
                        logger.warn(`- repoHasFile unknown response ${dep.githubUrl}: ${hasConfigPlugin}`);
                    }
                    logger.progressText(`Detecting Config Plugins [${i++}/${packagesToCheck.length}]`);
                    return {
                        ...dep,
                        hasConfigPlugin: hasConfigPlugin === true,
                    };
                }) as Promise<RnDepFull>,
        ),
    );

    const { fulfilled, rejected } = groupPromiseAllSettled(packagesToCheck, _processed);
    await updatePluginsListFile(fulfilled);

    if (rejected.length > 0) {
        logger.warn("Error while looking for config plugin:");
        for (const { input, reason } of rejected) {
            logger.log(`- ${input.githubUrl}: ${reason.message}`);
        }
    }

    logger.finish();
    return fulfilled;
};
