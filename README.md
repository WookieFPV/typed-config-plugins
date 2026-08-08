# typed-config-plugins [![npm][npm-image]][npm-url] ![npm][npm-dl-stats]

Type-safe helpers for Expo config plugins in `app.config.ts`.

`typed-config-plugins` gives you autocomplete and option validation for Expo config plugins so you can stop guessing the shape of plugin options in your config.

## What It Does

- Adds typed plugin helpers for Expo config authoring
- Ships ready-made typings for **501** third-party config plugins
- Lets you extend missing plugin types with module augmentation
- Works with normal Expo config output and only changes authoring ergonomics

> JSON config files cannot be type-checked. Use `app.config.ts` if you want the full benefit of this package.

## Coverage

**501 config plugins** are recognized out of the box (as of `v0.5.6`) — install the package, start typing a plugin name inside `plugin()`, and your editor takes it from there.

| What you get | Plugins |
| --- | ---: |
| Autocomplete for the plugin name *and* its options | 348 |
| Autocomplete for the plugin name only[^1] | 153 |
| **Total** | **501** |

[^1]: These packages ship a config plugin but no types for its options. `plugin("name", { … })` still autocompletes the name and accepts your options, they just aren't checked. You can add the missing types yourself — see [Extend Missing Plugin Types](#extend-missing-plugin-types).

More plugins are added with every release, so upgrading widens the coverage. Missing one you need? [Open an issue](https://github.com/WookieFPV/typed-config-plugins/issues) or use module augmentation in the meantime.

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
