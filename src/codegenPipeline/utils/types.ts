export type BaseRnDep = {
    android?: boolean;
    dev?: boolean;
    examples?: string[];
    expoGo?: boolean;
    fireos?: boolean;
    githubUrl: string;
    images?: string[];
    ios?: boolean;
    macos?: boolean;
    newArchitecture?: boolean;
    npmPkg?: string; // added in 1_add_npmPkg.ts (if not already there)
    template?: boolean;
    tvos?: boolean;
    unmaintained?: boolean;
    visionos?: boolean;
    web?: boolean;
    windows?: boolean;
};

export type ConfigPluginOverrides = {
    path?: string;
    ignore?: boolean;
    alias?: string[];
    name?: string;
    valid?: boolean;
};

export type RnDep = BaseRnDep & {
    npmPkg: string;
    hasConfigPlugin?: boolean; // added in 2_has_config_plugin.ts
    types?: TypePath;
    ignore?: boolean; // if true, ignore this package here
    origin?: "directory" | "gitHub";
};

type TypePath = {
    path: string;
    override?: ConfigPluginOverrides;
    error?: string;
    valid: boolean;
    packageExport?: boolean;
    // The export name that actually validated ("default", a named export, or "" for a bare
    // `export =` module). Auto-detected in step 5 - distinct from `override.name`, which is a
    // human-set pin. Absent on legacy entries, which default to "default".
    exportName?: string;
};

export type RnDepPersist = Pick<RnDep, "githubUrl" | "npmPkg" | "hasConfigPlugin" | "types" | "ignore" | "origin" | "unmaintained">;

/**
 * Result of resolving a GitHub URL to its npm package name (see `mapGetNpmPkg`).
 * `npmPkg` is absent when the lookup failed - the row is then marked `ignore` so it isn't retried
 * on every subsequent run.
 */
export type NpmPkgLookup = Pick<RnDep, "githubUrl"> & Partial<Pick<RnDep, "npmPkg" | "ignore">>;
