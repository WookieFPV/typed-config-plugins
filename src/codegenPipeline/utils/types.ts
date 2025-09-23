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

export type ConfigPluginOverrides =
    | false
    | {
          path?: string;
          tsIgnore?: true;
          notes?: string;
          alias?: string[];
      };

export type RnDep = BaseRnDep & {
    hasConfigPlugin?: boolean; // added in 2_has_config_plugin.ts
    override?: ConfigPluginOverrides;
    ignore?: boolean; // if true, ignore this package here
};

export type RnDepPersist = {
    githubUrl: string;
    npmPkg?: string;
    hasConfigPlugin?: boolean;
    override?: ConfigPluginOverrides;
    ignore?: boolean; // if true, ignore this package here
};

export type RnDepFull = RnDep & {
    hasConfigPlugin: boolean;
};
