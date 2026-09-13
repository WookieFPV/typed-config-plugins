import { uniq } from "es-toolkit/array";
import { fetchNpmPackageName } from "../utils/gitHub";
import type { NpmPkgLookup, RnDep } from "../utils/types";
import { npmPackageExists } from "./npmPackageExists";

export const mapGetNpmPkg = async (dep: Pick<RnDep, "githubUrl">): Promise<NpmPkgLookup> => {
    // The directory records some repos on `master` instead of `main`; try both and take whichever
    // resolves first rather than guessing.
    const urls = uniq([dep.githubUrl, dep.githubUrl.replace("/tree/main/", "/tree/master/")]);
    try {
        const { npmPkg, url: githubUrl } = await Promise.any(urls.map(async (url) => ({ url, npmPkg: await fetchNpmPackageName(url) })));

        if (!(await npmPackageExists(npmPkg))) return { githubUrl, ignore: true };
        return { githubUrl, npmPkg };
    } catch {
        return { githubUrl: dep.githubUrl, ignore: true };
    }
};
