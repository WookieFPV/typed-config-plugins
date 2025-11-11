import { uniqBy } from "es-toolkit/array";
import { packageListFile } from "../storage/mainPackageList";
import { stepLogger } from "../utils/logger";

const { logger } = stepLogger("Remove Duplicates");

export const removeDuplicates = async () => {
    logger.start();
    const allPackages = await packageListFile.load();

    const initialLength = allPackages.length;

    // We don't want to remove packages without npmPkg, so we use a random UUID for them
    const uniquePackages = uniqBy(allPackages, (p) => p.npmPkg ?? crypto.randomUUID());

    const diff = initialLength - uniquePackages.length;

    await packageListFile.save(uniquePackages);
    logger.finish(diff > 0 ? `Removed ${diff} duplicate package(s) based on npmPkg field.` : undefined);
};
