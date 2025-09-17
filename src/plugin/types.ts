import type { ConfigPlugin } from "@expo/config-plugins";

// biome-ignore lint/suspicious/noConfusingVoidType: ...
export type ConfigPluginOptions<T> = T extends ConfigPlugin<infer TOptions> ? Exclude<TOptions, void | undefined> : never;
