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
    const deps = Object.keys(packageJson.devDependencies ?? {});

    const newDeps = sortBy(packagesWithConfigPlugin, ["npmPkg"]).map((pkg) => pkg.npmPkg);

    const newPackages = without(newDeps, ...deps);
    const validNewDeps = await filterAsync(newPackages, npmPackageExists, { concurrency: 20 });

    if (validNewDeps.length) {
        logger.log(`Adding ${validNewDeps.length} new deps:`);

        await mapAsync(
            validNewDeps,
            (dep) => {
                logger.log(`- install ${dep}`);
                return Bun.$`bun --cwd=packageList i --dev --only-missing ${dep}`.quiet();
            },
            { concurrency: 1 },
        );
    }
};
