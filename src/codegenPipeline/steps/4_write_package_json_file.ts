import { file } from "bun";
import { without } from "es-toolkit";
import { filterAsync, mapAsync, sortBy } from "es-toolkit/array";
import { npmPackageExists } from "../npmRegistry/npmPackageExists";
import { packageListFile } from "../storage/mainPackageList";
import { stepLogger } from "../utils/logger";
import type { RnDep } from "../utils/types";

const { logger, step } = stepLogger("Save Config Plugin Package List");

export const updatePackagesPackageJsonFile = step(async () => {
    const packages = await packageListFile.load("withPlugin");

    await syncPackagesPackageJsonFile(packages);
});

const syncPackagesPackageJsonFile = async (packagesWithConfigPlugin: RnDep[]) => {
    const packageJson = await file("packageList/package.json").json();
    const deps = Object.keys(packageJson.optionalDependencies ?? {});

    const newDeps = sortBy(packagesWithConfigPlugin, ["npmPkg"]).map((pkg) => pkg.npmPkg);

    const newPackages = without(newDeps, ...deps);
    const validNewDeps = await filterAsync(newPackages, npmPackageExists, { concurrency: 20 });

    if (validNewDeps.length) {
        logger.log(`Adding ${validNewDeps.length} new deps:`);

        const failedDeps: string[] = [];

        await mapAsync(
            validNewDeps,
            async (dep) => {
                logger.log(`- install ${dep}`);
                // `.nothrow()` - a single broken install (bad tarball, failing lifecycle script,
                // engine mismatch) must not abort every subsequent package in this batch. Log and
                // move on; the package stays out of `packageList/package.json` and gets retried
                // next run.
                // `--ignore-scripts` matches the root `bun i --ignore-scripts` in run.ts - without
                // it, packages added this run would run lifecycle scripts while pre-existing ones
                // (installed via the root command) wouldn't.
                const result = await Bun.$`bun --cwd=packageList i --optional --only-missing --ignore-scripts ${dep}`.quiet().nothrow();
                if (result.exitCode !== 0) {
                    failedDeps.push(dep);
                    logger.warn(`- install failed for ${dep} (exit ${result.exitCode}): ${result.stderr.toString().trim()}`);
                }
            },
            { concurrency: 1 },
        );

        if (failedDeps.length) {
            logger.warn(`${failedDeps.length} package(s) failed to install and will be retried next run: ${failedDeps.join(", ")}`);
        }
    }
};
