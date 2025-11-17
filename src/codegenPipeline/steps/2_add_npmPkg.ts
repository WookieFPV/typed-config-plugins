import { mapAsync } from "es-toolkit/array";
import { mapGetNpmPkg } from "../npmRegistry/mapGetNpmPkg";
import { packageListFile } from "../storage/mainPackageList";
import { stepLogger } from "../utils/logger";

const { logger, step } = stepLogger("Adding NPM package names");

export const addNpmPackageName = step(async () => {
    const unknown = await packageListFile.load("withoutNpmPkg");

    if (unknown.length) {
        logger.log(`Packages without known npm package [${unknown.length}]`);
        logger.log(JSON.stringify(unknown.map((i) => i.githubUrl)));
    }

    if (unknown.length && !process.env.GITHUB_TOKEN) {
        logger.warn("Not GitHub Token set, aborting...\n");
        process.exit(1);
    }

    const fulfilled = await mapAsync(unknown, mapGetNpmPkg, { concurrency: 5 });

    await packageListFile.update(fulfilled, { override: true });
});
