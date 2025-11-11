import { uniq } from "es-toolkit/array";
import { fetchNpmPackageName } from "../utils/gitHub";
import type { RnDep } from "../utils/types";
import { npmPackageExists } from "./npmPackageExists";

export const mapGetNpmPkg = async (dep: Pick<RnDep, "githubUrl">): Promise<Pick<RnDep, "npmPkg" | "ignore" | "githubUrl">> => {
    const urls = uniq([dep.githubUrl, dep.githubUrl.replace("/tree/main/", "/tree/master/")]);
    try {
        const { npmPkg, url: githubUrl } = await Promise.any(
            urls.map(async (url) => ({
                url,
                npmPkg: await fetchNpmPackageName(url),
            })),
        );
        const exists = await npmPackageExists(npmPkg);
        if (!exists) {
            return { githubUrl, npmPkg: undefined as unknown as string, ignore: true };
        }
        return {
            githubUrl,
            npmPkg,
        };
    } catch (_e) {
        return { githubUrl: dep.githubUrl, npmPkg: undefined as unknown as string, ignore: true };
    }
};
