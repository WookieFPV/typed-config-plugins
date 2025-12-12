// Ignore ExpoConfig to support more versions of expo-config
type ExpoConfig = any;

export type ConfigPlugin<Props = void> = (config: ExpoConfig, props: Props) => ExpoConfig;

// biome-ignore lint/suspicious/noConfusingVoidType: ...
export type ConfigPluginOptions<T> = T extends ConfigPlugin<infer TOptions> ? Exclude<TOptions, void | undefined> : never;
