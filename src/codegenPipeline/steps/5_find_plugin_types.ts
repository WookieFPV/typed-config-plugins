import path from "node:path";
import { gitHubQueue } from "../utils/gitHub";
import { groupPromiseAllSettled } from "../utils/groupPromiseAllSettled";
import { stepLogger } from "../utils/logger";
import { packageListFile, updatePluginsListFile } from "../utils/packageListJson";
import type { RnDepFull } from "../utils/types";
import { findBestConfigPluginTypePathCombined } from "./6_codegen";

const { logger } = stepLogger("Find Config Plugin Type Path");

export const findConfigPluginTypePath = async (type: "onlyNew" | "full" = "onlyNew"): Promise<Array<RnDepFull>> => {
    logger.start();
    const allPackages = await packageListFile().load();

    const packagesToCheck = allPackages.filter((p) => !p.ignore && p.hasConfigPlugin && p.npmPkg && (type === "full" || !p.types?.path));
    logger.log("packagesToCheck", packagesToCheck.length);
    let i = 1;
    const _processed = await Promise.allSettled(
        packagesToCheck.map((dep) => {
            return gitHubQueue.add(async () => {
                try {
                    logger.progressText(`Detecting Config Plugin Types [${i++}/${packagesToCheck.length}]`);
                    // biome-ignore lint/style/noNonNullAssertion: fine here
                    const typePath = await findBestConfigPluginTypePathCombined(dep.npmPkg!);

                    return {
                        ...dep,
                        types: {
                            ...dep.types,
                            path: typePath,
                            error: undefined,
                            valid: await isValid(typePath),
                        },
                    };
                } catch (err) {
                    const msg = err instanceof Error ? err.message : "unknown error message";
                    return { ...dep, types: { ...dep.types, path: undefined, valid: false, error: msg } };
                }
            }) as Promise<RnDepFull>;
        }),
    );

    const { fulfilled, rejected } = groupPromiseAllSettled(packagesToCheck, _processed);
    await updatePluginsListFile(fulfilled);

    if (rejected.length > 0) {
        logger.warn("Error while looking for Config Plugin Type Path:");
        for (const { input, reason } of rejected) {
            // biome-ignore lint/style/noNonNullAssertion: fine here
            logger.log(`- ${input.npmPkg!}: ${reason.message}`);
        }
    }

    logger.finish();
    return fulfilled;
};

const isValid = async (typePath: string) => Bun.file(path.join("node_modules", typePath.endsWith(".d.ts") ? typePath : `${typePath}.d.ts`)).exists();
