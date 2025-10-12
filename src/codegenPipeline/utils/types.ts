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
};

export type RnDep = BaseRnDep & {
    hasConfigPlugin?: boolean; // added in 2_has_config_plugin.ts
    types?: TypePath;
    ignore?: boolean; // if true, ignore this package here
};

type TypePath =
    | {
          path: string;
          override?: ConfigPluginOverrides;
          error: never;
          valid: boolean;
      }
    | {
          path: never;
          override?: ConfigPluginOverrides;
          error: string;
          valid: false;
      };

export type RnDepPersist = {
    githubUrl: string;
    npmPkg?: string;
    hasConfigPlugin?: boolean;
    types?: TypePath;
    ignore?: boolean; // if true, ignore this package here
};

export type RnDepFull = RnDep & {
    hasConfigPlugin: boolean;
    types?: TypePath;
};
