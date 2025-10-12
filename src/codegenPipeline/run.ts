import { downloadAndMergeLists } from "./steps/1_merge_package_lists";
import { addNpmPackageName } from "./steps/2_add_npmPkg";
import { detectConfigPlugins } from "./steps/3_has_config_plugin";
import { updatePackagesPackageJsonFile } from "./steps/4_print_config_plugin_packages";
import { findConfigPluginTypePath } from "./steps/5_find_plugin_types";
import { codeGeneration } from "./steps/6_codegen";
import { promiseStep } from "./utils/logger";

await downloadAndMergeLists();

await addNpmPackageName();

// use "full" to detect changes in previously scanned packages:
await detectConfigPlugins("onlyNew");

await updatePackagesPackageJsonFile();

await promiseStep(Bun.$`bun i`.quiet(), "Bun install");

await findConfigPluginTypePath("full");

await codeGeneration();

await promiseStep(Bun.$`bun run lint`.quiet(), "Format code");

process.exit(0);
