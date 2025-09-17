import type { ConfigPlugin } from "@expo/config-plugins";

export type ConfigPluginOptions<T> = T extends ConfigPlugin<infer TOptions> ? Exclude<TOptions, undefined> : never;
