// Parse command line arguments
import { findBestConfigPluginTypePath } from "./findConfigPluginTypePath";

const args = process.argv.slice(2);

const searchPath = args[0];
if (args.length < 1 || !searchPath) {
    console.log("Add package name as argument");
    console.log("Example: bun run find my-package");
    process.exit(1);
}

const searchString = "ConfigPlugin";
const fileExtension = ".d.ts";

try {
    const results = await findBestConfigPluginTypePath(searchPath, searchString, fileExtension);
    console.log(`\nFound match:\n`);
    console.log(results);
} catch (e) {
    console.log(`No matches found for "${searchString}" in *.${fileExtension} files, reason:`);
    console.log(e instanceof Error ? e.message : e);
}
