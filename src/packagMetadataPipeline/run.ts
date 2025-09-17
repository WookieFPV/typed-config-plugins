import { downloadAndMergeLists } from "./steps/1_merge_package_lists";
import { addNpmPackageName } from "./steps/2_add_npmPkg";
import { detectConfigPlugins } from "./steps/3_has_config_plugin";

await downloadAndMergeLists();

await addNpmPackageName();

// use "full" to detect changes in previously scanned packages:
await detectConfigPlugins("onlyNew");

//await printConfigPluginPackages();

process.exit(0);
