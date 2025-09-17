import type { ThirdPartyAutomatedPlugins } from "./pluginTypes";

// biome-ignore lint: lint/suspicious/noEmptyInterface
export interface ThirdPartyPlugins {}

interface FuncOptionMap extends ThirdPartyPlugins, ThirdPartyAutomatedPlugins {}

export function plugin<Name extends keyof FuncOptionMap>(name: Name): [Name];

export function plugin<Name extends keyof FuncOptionMap, Options extends FuncOptionMap[Name]>(name: Name, options: Options): [Name, Options];

export function plugin<Name extends keyof FuncOptionMap, Options extends FuncOptionMap[Name]>(name: Name, options?: Options) {
    return options ? [name, options] : [name];
}

export type { ConfigPluginOptions } from "./types";
