# npm/bun audit notes

This repo uses Bun (`bun.lock`), so `bun audit` was used as the equivalent of
`npm audit` (there is no `package-lock.json`, and the workspace's
`patchedDependencies`/exact-pinned optional dependency tree is not resolvable
by npm at all).

All vulnerable packages listed below are **transitive dependencies of the
`packageList` workspace's `optionalDependencies`** — a list of several
thousand third-party Expo/React Native config plugins that exists purely so
the codegen pipeline (`src/codegenPipeline`) can introspect their types to
generate `dist/plugin.d.ts`. None of these packages are dependencies of the
published package (`files: ["dist"]`) or of the root `dependencies`/
`devDependencies`, and none of their code is imported/executed by
`src/plugin`, the tests, the build, or the CI pipeline.

## Fixed

- **`@clerk/clerk-expo`** (`packageList/package.json`): bumped `2.19.31` ->
  `2.19.36` (patch bump, pinned exact version). This also picked up
  `@clerk/clerk-react` `5.61.3` -> `5.61.6` as a transitive fix. Fixes
  GHSA-w24r-5266-9c3c (high — authorization bypass when combining
  organization/billing/reverification checks). Applied via `bun audit fix`
  (no `--force`, no breaking changes) and verified with `bun run typecheck`,
  `bun run lint:CI`, `bun test`, and `bun run build`.

## Not fixed (requires a major/breaking bump of a transitive dependency)

`bun audit fix` (the bun equivalent of `npm audit fix`, without `--force`)
reports every one of these as **"blocked by a dependent's range"**: the fix
version is outside the semver range (or exact pin) that some optional
third-party plugin in `packageList` depends on, so fixing them requires a
major version bump of that upstream plugin (or of `packageList`'s pinned
version of it), which is out of scope for a non-breaking dependency bump and
would need per-plugin verification against ~1000+ optional packages.

| Package | Severity (highest) | Advisory (representative) | Current | Fix needs |
|---|---|---|---|---|
| `@opentelemetry/core` | moderate | GHSA-8988-4f7v-96qf (unbounded memory allocation in W3C Baggage propagation) | 2.0.1 | `@opentelemetry/instrumentation-fetch`, `@opentelemetry/sdk-trace-web`, `@opentelemetry/sdk-trace-base`, `@opentelemetry/resources` all pin `@opentelemetry/core@2.0.1` exactly; needs 2.8.0+ |
| `@sentry/browser` | moderate | GHSA-593m-55hh-j8gv (prototype pollution gadget) | 7.81.1 | `@sentry/react@7.81.1` and `@sentry/react-native@5.17.0` pin this exactly; needs 7.119.1+ |
| `@sentry/react-native` | low | GHSA-68c2-4mpx-qh95 (auth token leakage via Expo plugin) | 5.17.0 | `sentry-expo@7.2.0` pins this exactly; needs 5.19.1+ |
| `@stablelib/ed25519` | moderate | GHSA-x3ff-w252-2g7j (ECDSA-style signature malleability) | 1.0.3 | `@credo-ts/core`, `@digitalcredentials/ed25519-verification-key-2020`, `@walletconnect/relay-auth` all require `^1.0.x`; needs 2.1.0 (major) |
| `@xmldom/xmldom` | high (multiple XML injection/DoS advisories) | GHSA-wh4c-j3r5-mjhp, GHSA-2v35-w6hq-6mfw, and others | 0.7.13 | `@expo/plist@0.0.14–0.2.2` and `@lyrahealth-inc/react-native-orientation-plugin` require `~0.7.x`; needs 0.8.15+ |
| `xmldom` (legacy unscoped package, deprecated) | critical | GHSA-crh6-fp67-6883 (multiple root nodes in a DOM) and many others | 0.5.0/0.6.0 | **No published version fixes some of these advisories at all** (package is deprecated in favor of `@xmldom/xmldom`); would require the upstream dependents to migrate off the unscoped `xmldom` package entirely |
| `adm-zip` | high | GHSA-xcpc-8h2w-3j85 (crafted ZIP triggers 4GB allocation) | 0.5.18 | `@rock-js/platform-apple-helpers`/`@rock-js/tools` require `^0.5.16`; needs 0.6.1 (major) |
| `ajv` | moderate | GHSA-2g4f-4pwh-qvx6 (ReDoS with `$data` option) | 8.11.0 | `expo-dev-launcher@3.6.10`/`4.0.29` pin `8.11.0` exactly; needs 8.18.0+ |
| `axios` | high (many CVEs: SSRF, credential leakage, prototype pollution, ReDoS) | GHSA-jr5f-v2jv-69x6 and ~20 others | 0.25.0 | `@crowdin/ota-client@0.7.0` pins `0.25.0` exactly; needs 0.33.0 (major, pre-1.0 line) |
| `chrome-launcher` | critical | GHSA-gp2j-mg4w-2rh5 (OS command injection) | 0.11.2 | `unitest@2.1.2` requires `^0.11.2`; needs 0.13.2 (major) |
| `decode-uri-component` | moderate | GHSA-vcc3-ghjq-m6fr (DoS via exponential decoding) | 0.2.2 | `query-string@7.1.3` requires `^0.2.2`; needs 0.5.0 (major) |
| `elliptic` | critical | GHSA-vjh7-7g9h-fjfh (private key extraction on malformed ECDSA input) | 6.5.7 / 6.6.1 | **No published version fixes this yet** for the pinned range in this tree |
| `fast-xml-parser` | moderate | GHSA-gh4j-gqv2-49f6 (XML comment/CDATA injection in XMLBuilder) | 4.5.7 | Multiple `@react-native-community/cli-*` and `@rock-js/*` packages require `^4.x`; needs 5.7.0 (major) |
| `file-type` | moderate | GHSA-5v7r-6r5c-r473 (infinite loop in ASF parser) | 16.5.4 | `@jimp/core`/`music-metadata@7.14.0` require `^16.5.4`; needs 21.3.1 (major) |
| `image-size` | high | GHSA-w3rx-r6r6-pgpr, GHSA-5p2g-fcmc-qvqq (infinite loop DoS in ICNS/JXL/HEIF parsers) | 1.2.1 | Multiple `metro@0.8x.x` versions require `^1.0.2`; needs 2.0.3 (major) |
| `minimatch` | high | GHSA-3ppc-4f35-3m26 and others (ReDoS) | 9.0.3 | `@typescript-eslint/typescript-estree@6.21.0` pins `9.0.3` exactly; needs 9.0.7+ |
| `minimist` | critical | GHSA-xvch-5gv4-984h (prototype pollution) | 0.0.8 | `mkdirp@0.5.1` requires `0.0.8` exactly; needs 0.2.4 (major) |
| `music-metadata` | high | GHSA-v6c2-xwv6-8xf7 (infinite loop in ASF parser) | 7.14.0 | `music-metadata-browser@2.5.11` requires `^7.13.3`; needs 11.12.2 (major) |
| `nanoid` | high | GHSA-2v37-7h3g-55p8 and others (predictable/looping generators) | 3.3.4 | `react-native-webassembly@0.3.3` pins `3.3.4` exactly; needs 3.3.18+ |
| `node-fetch` | high | GHSA-r683-j2x4-v87g (forwards secure headers to untrusted sites) | 1.7.3 | `isomorphic-fetch@2.2.1` requires `^1.0.1`; needs 2.6.7 (major) |
| `postcss` | high | GHSA-6g55-p6wh-862q and others (arbitrary file read via sourceMappingURL) | 8.4.49 | Several `@expo/metro-config` versions pin `~8.4.21`/`~8.4.32`; needs 8.5.23+ |
| `react-router` | moderate | GHSA-wrjc-x8rr-h8h6 (open redirect), GHSA-337j-9hxr-rhxg | 6.30.6 | `react-router-native@6.30.6` pins this exactly; needs 7.18.0 (major) |
| `semver` | high | GHSA-c2qf-rxjj-qqgw (ReDoS) | 7.3.2 | Several `@expo/config`/`@expo/image-utils`/`@expo/prebuild-config` versions pin `7.3.2` exactly; needs 7.5.2+ |
| `send` | low | GHSA-m6fv-jmcg-4jfg (template injection -> XSS) | 0.18.0 | `@expo/cli@0.10.13`/`0.18.31` require `^0.18.0`; needs 0.19.0 (minor but outside pinned range) |
| `sharp` | high | GHSA-f88m-g3jw-g9cj, GHSA-rgj7-g3m4-5g8c (libvips/libheif CVEs) | 0.32.6 | `react-native-bootsplash@6.3.11` requires `^0.32.6`; needs 0.35.4 (major) |
| `shell-quote` | critical | GHSA-w7jw-789q-3m8p (unescaped newlines in `.op` values) | 1.8.0 | `@segment/sovran-react-native@1.1.4` pins `1.8.0` exactly; needs 1.9.0+ |
| `stream-json` | moderate | GHSA-528h-pc64-c93x (O(depth²) filters -> DoS) | 1.9.1 | `jayson@4.3.0` requires `^1.9.1`; needs 3.5.0 (major) |
| `tar` | critical (also several high/moderate) | GHSA-23hp-3jrh-7fpw (decompression DoS) and many path-traversal advisories | 6.2.1 | `@expo/cli`, `cacache` require `^6.x`; needs 7.5.x+ (major) |
| `tmp` | high | GHSA-ph9p-34f9-6g65 (path traversal via prefix/postfix) | 0.0.33 | `patch-package@7.0.2` requires `^0.0.33`; needs 0.2.6 (major) |
| `toml` | high | GHSA-82x6-q7mm-w9cf (uncontrolled recursion), GHSA-v5mp-jgw5-2x6j (prototype pollution) | 3.0.0 | `@stellar/stellar-sdk@14.0.0-rc.3` requires `^3.0.0`; needs 4.2.0 (major) |
| `undici` | high | GHSA-vrm6-8vpv-qv8q and others (WebSocket memory exhaustion, request smuggling) | 5.29.0 | `@ai-sdk/provider-utils`/`@digitalbazaar/http-client` require `^5.x`; needs 6.28.0 (major) |
| `uuid` | moderate | GHSA-w5hq-g745-h8pq (missing buffer bounds check) | 3.4.0 / 7.0.3 / 8.3.2 / 9.0.1 / 10.0.0 (multiple ranges pinned by different plugins) | Many `expo-*`/`@bacons/xcode`/`@credo-ts/core` etc. pin old major versions of `uuid`; needs 11.1.1 everywhere (major, and would require every one of those upstream plugins to update first) |
| `valibot` | moderate | GHSA-5qjj-4xww-7phc (`record()` issue paths break `flatten()`) | 1.2.0 | `dcql@3.0.0` pins `1.2.0` exactly; needs 1.4.2+ |
| `ws` | high | GHSA-3h5v-q93c-6h6q, GHSA-96hv-2xvq-fx4p (DoS via many headers / tiny fragments) | 3.3.3 / 8.18.0 / 8.18.2 | `chrome-remote-interface`, `@ethersproject/providers`, `viem` pin specific old versions; needs 5.2.5+/8.21.0+ (major for the 3.x line) |
| `xml2js` | moderate | GHSA-776f-qx25-q3cc (prototype pollution) | 0.4.23 | Several old `@expo/config-plugins` versions (2.x–6.x) pin `0.4.23` exactly; needs 0.5.0+ (major) |

## What would be required to fix the rest

Each row above is pinned by an **optional, third-party Expo/React Native
config plugin** listed in `packageList/package.json`'s `optionalDependencies`
(used only to introspect types for codegen, not executed at runtime by this
package). Fixing them for real would mean:

1. Waiting for (or PRing) an update in the upstream plugin that depends on
   the vulnerable package, so its own dependency range allows the patched
   version.
2. Bumping that upstream plugin's pinned version in
   `packageList/package.json`, which for many of these plugins may itself be
   a breaking/major change requiring re-verification that the plugin's types
   are still resolvable by the codegen pipeline.
3. For `elliptic` and the deprecated unscoped `xmldom` package, there is
   currently **no published fixed version** that resolves within the
   existing dependency graph at all (see the `no published version fixes`
   section from `bun audit fix` output) — the only paths forward are to wait
   for upstream fixes or drop/replace the plugins that pull them in.

Given the scale (~1000+ optional third-party packages, none of which affect
the published `dist/` output, the plugin runtime code, or CI-covered
build/lint/test/typecheck), a `--force` bump was intentionally **not**
performed, since it would rewrite many pinned versions to incompatible
majors across the tree without any way to verify each affected plugin still
works.
