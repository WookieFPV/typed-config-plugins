import { computePackageExportFlag } from "../searchTypes/computePackageExportFlag";
import { isExpectedExportsBlock } from "../searchTypes/isExpectedExportsBlock";
import { verifyExportType } from "../searchTypes/verifyExportType";
import { packageListFile } from "../storage/mainPackageList";
import { stepLogger } from "../utils/logger";
import type { RnDepPersist } from "../utils/types";

const { logger, step } = stepLogger("Revalidate Plugin Types");

// `types.path` is only (re-)discovered for packages that don't have one yet (see step 5).
// But the npm package behind an already-resolved path can ship a different `.d.ts` shape on
// every release - a dropped default export, a renamed file, types removed entirely. Without
// re-checking already-known paths, that drift only surfaces as a `tsc` failure days or weeks
// later. This step re-verifies every existing path/export pair on every run, independent of
// the expensive path-discovery step, so stale entries get flagged automatically instead of
// requiring a human to notice the CI failure and hand-add an `override`.
export const revalidate = (dep: RnDepPersist): RnDepPersist => {
    const types = dep.types;
    if (!types?.path) return dep;
    // Ignored or manually pinned (`override.valid`) - respect the human's decision.
    if (types.override?.ignore || types.override?.valid !== undefined) return dep;

    const effectivePath = types.override?.path ?? types.path;
    const exportName = types.override?.name ?? "default";
    const result = verifyExportType(effectivePath, exportName);

    // `packageExport` is only computed once, when a path is first discovered (step 5). Re-derive
    // it here too, so a package that adds/tightens `exports` in a *later* release - after its path
    // was already resolved and recorded - still gets flagged, instead of codegen silently emitting
    // an unsuppressed (and now permanently broken) import for it.
    const packageExport = computePackageExportFlag(dep.npmPkg, effectivePath);

    // A path that reaches past what the package's `exports` map allows (`packageExport: true`) is
    // *expected* to fail resolution this way - it was chosen because a matching `.d.ts` was found
    // on disk (see `findBestConfigPluginTypePathCombined`), so treat it as valid rather than
    // demoting a genuinely-typed package to `unknown`.
    if (isExpectedExportsBlock(result, packageExport)) {
        if (types.valid === true && !types.error && packageExport === types.packageExport) return dep;
        return { ...dep, types: { ...types, packageExport, valid: true, error: undefined } };
    }

    // A missing module on a package that ISN'T reaching past its own `exports` map is often just
    // this run's `bun i` failing to fetch an optional dependency (registry hiccup, rate limit,
    // transient network error) rather than the package actually disappearing or being renamed.
    // Don't let that flip valid -> invalid, and don't let it churn the recorded error message on
    // an already-invalid entry either - only a confirmed shape mismatch (the module resolved but
    // the export didn't) should change either field.
    if (!result.valid && result.moduleNotFound) {
        if (packageExport === types.packageExport) return dep;
        return { ...dep, types: { ...types, packageExport } };
    }

    if (result.valid === types.valid && (result.valid || result.error === types.error) && packageExport === types.packageExport) return dep;

    return {
        ...dep,
        types: {
            ...types,
            packageExport,
            valid: result.valid,
            error: result.valid ? undefined : result.error,
        },
    };
};

export const revalidatePluginTypes = step(async (alreadyCheckedThisRun: ReadonlySet<string> = new Set()): Promise<Array<RnDepPersist>> => {
    const allPackages = await packageListFile.load("withPluginAndTypes");
    // Packages step 5 just (re-)validated this run don't need a second, redundant check here -
    // this step exists to catch drift in *previously* resolved entries, not to re-verify
    // something already verified moments ago.
    const packages = allPackages.filter((dep) => !alreadyCheckedThisRun.has(dep.githubUrl));
    if (packages.length) logger.log(`Revalidate Plugin Types: ${packages.length}`);

    const fulfilled = packages.map(revalidate);

    const changed = fulfilled.filter((dep, i) => dep !== packages[i]);
    if (changed.length) logger.log(`Revalidate Plugin Types: ${changed.length} entries changed`);

    // Written via a full load+save (rather than `packageListFile.update()`) because `update()`
    // deep-merges `types` and silently ignores explicit `undefined`s (e.g. clearing a
    // previously recorded `error` once a package becomes valid again would otherwise be a no-op).
    if (changed.length) {
        const byKey = new Map(changed.map((dep) => [dep.githubUrl, dep]));
        const allPackages = await packageListFile.load();
        const merged = allPackages.map((dep) => byKey.get(dep.githubUrl) ?? dep);
        await packageListFile.save(merged);
    }

    return fulfilled;
});
