import { file } from "bun";
import { packageListFile } from "../utils/packageListJson";
import type { RnDep } from "../utils/types";

export type ConfigPluginOverrides = {
    correct: Array<string>;
    overrides: Array<{ package: string; tsIgnore: true } | { package: string; path: string }>;
};
export const getConfigPluginOverridesCorrect = async () => {
    const configPluginOverrides = file("src/packagMetadataPipeline/data/typedConfigPlugins.json");
    const { correct }: ConfigPluginOverrides = await configPluginOverrides.json();

    const packages = await packageListFile().load();
    return packages.filter((pkg) => pkg.npmPkg && correct.includes(pkg.npmPkg));
};

//getConfigPluginOverrides()

const _ingestValidPackages = async () => {
    const packages = await packageListFile().load();
    const packages2 = await getConfigPluginOverridesCorrect();

    const newPackages = packages.map((p) => {
        if (packages2.find((p2) => p2.npmPkg === p.npmPkg)) {
            return { ...p, override: false } as RnDep;
        }
        return p;
    });
    await packageListFile().save(newPackages);
};
