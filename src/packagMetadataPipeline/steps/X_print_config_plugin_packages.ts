import path from "node:path";
import { file } from "bun";
import { stepLogger } from "../utils/logger";
import { packageListFile } from "../utils/packageListJson";
import type { RnDep } from "../utils/types";

const logger = stepLogger("save Config Plugin Package List");

const sortByPackage = (a: RnDep, b: RnDep) => a?.npmPkg?.localeCompare(b?.npmPkg ?? "") ?? 0;

export const printConfigPluginPackages = async () => {
    logger.start();
    const packages = await packageListFile().load();

    const packagesWithConfigPlugin = packages.filter((p) => p.hasConfigPlugin);

    const packageJsonObj = Object.fromEntries(packagesWithConfigPlugin.sort(sortByPackage).map((pkg) => [pkg.npmPkg, "*"]));
    const packageJson = path.join(import.meta.dir, "template_packages.json");
    await file(packageJson).write(JSON.stringify(packageJsonObj, null, 2));

    const pluginsList = packagesWithConfigPlugin.map((pkg) => pkg.npmPkg);
    const outPath = path.join(import.meta.dir, "config-plugin-packages.json");
    await file(outPath).write(JSON.stringify(pluginsList, null, 2));
    logger.finish();
};
