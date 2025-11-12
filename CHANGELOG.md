# Changelog

## [0.5.0](https://github.com/WookieFPV/typed-config-plugins/compare/v0.4.2...v0.5.0) (2025-11-12)


### Features

* add more 273 more package types (using gitHub API as data source) ([#15](https://github.com/WookieFPV/typed-config-plugins/issues/15)) ([caaa9a6](https://github.com/WookieFPV/typed-config-plugins/commit/caaa9a67a1376e57f63303ded391fb8c6661fade))

## [0.4.2](https://github.com/WookieFPV/typed-config-plugins/compare/v0.4.1...v0.4.2) (2025-10-22)


### Bug Fixes

* improve type detection, add package name even without types (if not valid) ([324b7c6](https://github.com/WookieFPV/typed-config-plugins/commit/324b7c62fb5d08c3850b2e107b3e42e6bb299a67))

## [0.4.1](https://github.com/WookieFPV/typed-config-plugins/compare/v0.4.0...v0.4.1) (2025-10-21)


### Bug Fixes

* sentry config plugin works with both names (@sentry/react-native/expo and @sentry/react-native) ([10237ad](https://github.com/WookieFPV/typed-config-plugins/commit/10237ade5572472c31b5a300071dfb0325fce380))

## [0.4.0](https://github.com/WookieFPV/typed-config-plugins/compare/v0.3.0...v0.4.0) (2025-10-21)


### Features

* add types packages: ([47d1ea6](https://github.com/WookieFPV/typed-config-plugins/commit/47d1ea620f8053a041e3c8018a4f703d9b0b575d))
  * patch-project
  * @leanplum/react-native-sdk
  * react-native-spotlight-search
  * react-native-app-auth
  * @didomi/react-native
  * llama.rn
  * react-native-vector-image

## [0.3.0](https://github.com/WookieFPV/typed-config-plugins/compare/v0.2.0...v0.3.0) (2025-09-23)


### Features

* add types for 8 more packages: ([d5dfa0c](https://github.com/WookieFPV/typed-config-plugins/commit/d5dfa0c0c79ba11d82c445d33b5d9de762ecf588))
* improve codegen to handle more edge cases ([204be55](https://github.com/WookieFPV/typed-config-plugins/commit/204be55dedd8fb9cb2ef402d7bc9823134ab33bf))
* show progress on slow tasks (require ~2k API calls) ([0ae8aff](https://github.com/WookieFPV/typed-config-plugins/commit/0ae8aff12b9391df2ffe3301c5e10ccd40f74750))

## [0.2.0](https://github.com/WookieFPV/typed-config-plugins/compare/v0.1.0...v0.2.0) (2025-09-19)


### Features

* use inline type imports to simplify types, add pipeline to read all packages from react-native-directory and use that info to auto generate the packages types for third party packages ([38e93a6](https://github.com/WookieFPV/typed-config-plugins/commit/38e93a679a1d6bd06ada1194eb0123967be8caf7))

## [0.1.0](https://github.com/WookieFPV/typed-config-plugins/compare/v0.0.1...v0.1.0) (2025-09-12)


### Features

* improve the return type of plugin plugin. Now correctly return ["plugin"] or ["plugin", options] if options are supplied ([2226eb8](https://github.com/WookieFPV/typed-config-plugins/commit/2226eb89d83d66666a05a99f79c68b41a6e39990))


### Bug Fixes

* loosen requirement of @expo/config-plugins version to use the already used version of consumers instead of the version of this package ([a170e49](https://github.com/WookieFPV/typed-config-plugins/commit/a170e491596ba043f16900def079685856e1d0de))

## 0.0.1 (2025-09-10)


### Features

* first working version that actually works in a mid-size app with ~10 config plugins ([d7f1532](https://github.com/WookieFPV/typed-config-plugins/commit/d7f15329906a243d8a9e8d41f96992a3a12a3159))


### Miscellaneous Chores

* release 0.0.1 ([c13562c](https://github.com/WookieFPV/typed-config-plugins/commit/c13562cac37987ac69c7c5eadf37fe4a021d6d9e))
