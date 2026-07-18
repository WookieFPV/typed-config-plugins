import { mapAsync } from "es-toolkit/array";
import { packageListFile } from "../storage/mainPackageList";
import { cleanupUrl } from "../utils/cleanupUrl";
import { repoHasFile } from "../utils/gitHub";
import { stepLogger } from "../utils/logger";
import type { RnDepPersist } from "../utils/types";

const { logger, step } = stepLogger("Detecting Config Plugins");

const mapHasConfigPlugin = async (dep: RnDepPersist): Promise<RnDepPersist> => {
    try {
        const [baseUrl, path] = cleanupUrl(dep.githubUrl);
        const { hasConfigPlugin } = await repoHasFile(baseUrl, "app.plugin.js", path);
        if (typeof hasConfigPlugin !== "boolean") {
            logger.warn(`- repoHasFile unknown response ${dep.githubUrl}: ${hasConfigPlugin}`);
            // leave dep.hasConfigPlugin untouched (undefined) so it's retried on the next run
            return dep;
        }
        return { ...dep, hasConfigPlugin };
    } catch (err) {
        // `mapAsync` is `Promise.all` under the hood - one rejection here would abort the whole
        // batch (and the whole run). Isolate failures to this one package instead: leave it
        // untouched so it's retried next run, same as the "unknown response" branch above.
        const message = err instanceof Error ? err.message : String(err);
        logger.warn(`- repoHasFile failed ${dep.githubUrl}: ${message}`);
        return dep;
    }
};

export const detectConfigPlugins = step(async (type: "onlyNew" | "full" = "onlyNew") => {
    const packagesToCheck = await packageListFile.load(type === "full" ? "withNpmPkg" : "unknownPlugin");

    if (packagesToCheck.length > 0 && !process.env.GITHUB_TOKEN) {
        logger.warn("Not GitHub Token set, aborting...\n");
        process.exit(1);
    }

    const fulfilled = await mapAsync(packagesToCheck, mapHasConfigPlugin, { concurrency: 20 });
    await packageListFile.update(fulfilled);
});
