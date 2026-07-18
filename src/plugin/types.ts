// Ignore ExpoConfig to support more versions of expo-config
// biome-ignore lint/suspicious/noExplicitAny: We want to allow every expo config
type ExpoConfig = any;

export type ConfigPlugin<Props = void> = (config: ExpoConfig, props: Props) => ExpoConfig;

// Falls back to `any` (not `never`) for packages with no usable types - `never` makes the options
// argument uncallable with anything, which is worse than the permissive `any` an untyped JS import
// would have produced.
// biome-ignore lint/suspicious/noConfusingVoidType: ...
// biome-ignore lint/suspicious/noExplicitAny: intentional fallback for untyped packages
export type ConfigPluginOptions<T> = T extends ConfigPlugin<infer TOptions> ? Exclude<TOptions, void | undefined> : any;
