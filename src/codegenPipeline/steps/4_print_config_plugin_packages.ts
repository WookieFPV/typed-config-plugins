import { file } from "bun";
import { sortByPackage } from "../utils/filterPackages";
import { stepLogger } from "../utils/logger";
import { packageListFile } from "../utils/packageListJson";

const { logger } = stepLogger("Save Config Plugin Package List");

export const updatePackagesPackageJsonFile = async () => {
    logger.start();
    const packages = await packageListFile().load();
    const packagesWithConfigPlugin = packages.filter((p) => p.hasConfigPlugin);

    const devDependencies = Object.fromEntries(packagesWithConfigPlugin.sort(sortByPackage).map((pkg) => [pkg.npmPkg, "*"]));

    const packageJsonContent = {
        name: "typed-config-plugins-package-list",
        version: "0.0.1",
        devDependencies: devDependencies,
    };

    await file("packageList/package.json").write(JSON.stringify(packageJsonContent, null, 2));
    logger.finish();
};

/*
    const pluginsList = packagesWithConfigPlugin.map((pkg) => pkg.npmPkg);
    const outPath = path.join(import.meta.dir, "config-plugin-packages.json");
    await file(outPath).write(JSON.stringify(pluginsList, null, 2));
*/
