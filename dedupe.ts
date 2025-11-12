import { packageListFile } from "./src/codegenPipeline/storage/mainPackageList";

// Manually wipe items that are duplicated (based on npmPpk)
const packagesToCheck = await packageListFile.load();

const npmPkgArr = packagesToCheck.map((pkg) => pkg.npmPkg).filter(Boolean);
const dedupedNpmPkgArr = npmPkgArr.filter((item) => npmPkgArr.indexOf(item) === npmPkgArr.lastIndexOf(item));
const dedupedPackages = packagesToCheck.filter((pkg) => pkg.npmPkg === undefined || dedupedNpmPkgArr.includes(pkg.npmPkg));

await packageListFile.save(dedupedPackages);
console.log(`Deduped packages from ${packagesToCheck.length} to ${dedupedPackages.length}`);
