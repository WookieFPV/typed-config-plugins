# typed-config-plugins [![npm][npm-image]][npm-url] ![npm][npm-dl-stats]

Type-safe helpers for Expo config plugins in `app.config.ts`.

`typed-config-plugins` gives you autocomplete and option validation for Expo config plugins so you can stop guessing the shape of plugin options in your config.

## What It Does

- Adds typed plugin helpers for Expo config authoring
- Ships generated typings for many common third-party plugins
- Lets you extend missing plugin types with module augmentation
- Works with normal Expo config output and only changes authoring ergonomics

> JSON config files cannot be type-checked. Use `app.config.ts` if you want the full benefit of this package.

## Install

```bash
npm install typed-config-plugins
```

## Quick Start

```ts
import { type ConfigContext, type ExpoConfig } from "expo/config";
import { plugin } from "typed-config-plugins";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  plugins: [
    plugin("expo-build-properties", {
      android: { minSdkVersion: 26 }
    }),

    // Regular Expo syntax still works too:
    ["expo-build-properties", { android: { minSdkVersion: 26 } }]
  ]
});
```

## Extend Missing Plugin Types

If a plugin is not covered yet, add your own typings with module augmentation:

```ts
import "typed-config-plugins";

declare module "typed-config-plugins" {
  interface ThirdPartyPlugins {
    "demo-package": {
      bar: string;
      baz?: number;
    };
  }
}
```

Now `plugin("demo-package", { ... })` will be type-checked in `app.config.ts`.

## Good Fit

- You already use `app.config.ts`
- You want autocomplete for plugin options
- You maintain custom or third-party config plugins
- You want TypeScript errors before `expo prebuild`

[npm-image]: https://img.shields.io/npm/v/typed-config-plugins
[npm-url]: https://www.npmjs.com/package/typed-config-plugins
[npm-dl-stats]: https://img.shields.io/npm/dm/typed-config-plugins
