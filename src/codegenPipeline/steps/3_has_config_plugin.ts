import { mapAsync } from "es-toolkit/array";
import { JSDELIVR_REPO_TOO_LARGE, npmPackageHasFile } from "../npmRegistry/npmPackageHasFile";
import { packageListFile } from "../storage/mainPackageList";
import { cleanupUrl } from "../utils/cleanupUrl";
import { repoHasFile } from "../utils/gitHub";
import { stepLogger } from "../utils/logger";
import type { RnDepPersist } from "../utils/types";

const { logger, step } = stepLogger("Detecting Config Plugins");

// Fallback for the (rare) case where the package's git repo exceeds jsdelivr's 150MB size limit
// and it 403s - check the file directly via the GitHub contents API instead.
const mapHasConfigPluginViaGitHub = async (dep: RnDepPersist): Promise<RnDepPersist> => {
    if (!process.env.GITHUB_TOKEN) {
        logger.warn(`- ${dep.npmPkg} exceeds jsdelivr's size limit and GITHUB_TOKEN is not set, skipping (will retry next run)`);
        return dep;
    }
    try {
        const [baseUrl, path] = cleanupUrl(dep.githubUrl);
        const { hasFile } = await repoHasFile(baseUrl, "app.plugin.js", path);
        if (typeof hasFile !== "boolean") {
            logger.warn(`- repoHasFile unknown response ${dep.githubUrl}: ${hasFile}`);
            // leave dep.hasConfigPlugin untouched (undefined) so it's retried on the next run
            return dep;
        }
        return { ...dep, hasConfigPlugin: hasFile };
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger.warn(`- repoHasFile failed ${dep.githubUrl}: ${message}`);
        return dep;
    }
};

const mapHasConfigPlugin = async (dep: RnDepPersist): Promise<RnDepPersist> => {
    try {
        const { hasFile } = await npmPackageHasFile(dep.npmPkg, "app.plugin.js");
        if (hasFile === JSDELIVR_REPO_TOO_LARGE) {
            return await mapHasConfigPluginViaGitHub(dep);
        }
        if (typeof hasFile !== "boolean") {
            logger.warn(`- npmPackageHasFile unknown response ${dep.npmPkg}: ${hasFile}`);
            // leave dep.hasConfigPlugin untouched (undefined) so it's retried on the next run
            return dep;
        }
        return { ...dep, hasConfigPlugin: hasFile };
    } catch (err) {
        // `mapAsync` is `Promise.all` under the hood - one rejection here would abort the whole
        // batch (and the whole run). Isolate failures to this one package instead: leave it
        // untouched so it's retried next run, same as the "unknown response" branch above.
        const message = err instanceof Error ? err.message : String(err);
        logger.warn(`- npmPackageHasFile failed ${dep.npmPkg}: ${message}`);
        return dep;
    }
};

export const detectConfigPlugins = step(async (type: "onlyNew" | "full" = "onlyNew") => {
    const packagesToCheck = await packageListFile.load(type === "full" ? "withNpmPkg" : "unknownPlugin");
    const fulfilled = await mapAsync(packagesToCheck, mapHasConfigPlugin, { concurrency: 20 });
    await packageListFile.update(fulfilled);
});
