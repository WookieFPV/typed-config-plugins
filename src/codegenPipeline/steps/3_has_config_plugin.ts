import pMap from "p-map";
import { packageListFile } from "../storage/mainPackageList";
import { cleanupUrl } from "../utils/cleanupUrl";
import { repoHasFile } from "../utils/gitHub";
import { stepLogger } from "../utils/logger";
import type { RnDepPersist } from "../utils/types";

const { logger, step } = stepLogger("Detecting Config Plugins");

const mapHasConfigPlugin = async (dep: RnDepPersist): Promise<RnDepPersist> => {
    const [baseUrl, path] = cleanupUrl(dep.githubUrl);
    const { hasConfigPlugin } = await repoHasFile(baseUrl, "app.plugin.js", path);
    if (typeof hasConfigPlugin !== "boolean") {
        logger.warn(`- repoHasFile unknown response ${dep.githubUrl}: ${hasConfigPlugin}`);
    }
    return { ...dep, hasConfigPlugin: hasConfigPlugin === true };
};

export const detectConfigPlugins = step(async (type: "onlyNew" | "full" = "onlyNew") => {
    const packagesToCheck = await packageListFile.load(type === "full" ? "withNpmPkg" : "unknownPlugin");

    if (packagesToCheck.length > 0 && !process.env.GITHUB_TOKEN) {
        logger.warn("Not GitHub Token set, aborting...\n");
        process.exit(1);
    }

    const fulfilled = await pMap(packagesToCheck, mapHasConfigPlugin, { concurrency: 20 });
    await packageListFile.update(fulfilled);
});
