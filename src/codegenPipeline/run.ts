import { ingestGithubInputJson } from "./githubSearch/ingestGithubInputJson";
import { downloadAndMergeLists } from "./steps/1_merge_package_lists";
import { addNpmPackageName } from "./steps/2_add_npmPkg";
import { detectConfigPlugins } from "./steps/3_has_config_plugin";
import { updatePackagesPackageJsonFile } from "./steps/4_write_package_json_file";
import { findConfigPluginTypePath } from "./steps/5_find_plugin_types";
import { codeGeneration } from "./steps/7_codegen";
import { typecheck } from "./steps/8_Typecheck";
import { promiseStep } from "./utils/logger";

await downloadAndMergeLists();

await addNpmPackageName();

await ingestGithubInputJson();

// await removeDuplicates();

await detectConfigPlugins("onlyNew");

await updatePackagesPackageJsonFile();

await promiseStep(Bun.$`bun i`.quiet(), "Bun install --ignore-scripts");

await findConfigPluginTypePath("onlyNew");

await codeGeneration();

await promiseStep(Bun.$`bun run lint`.quiet(), "Format code");

await typecheck();

process.exit(0);
