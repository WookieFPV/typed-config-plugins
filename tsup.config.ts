import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/plugin/plugin.ts"],
    format: ["esm"],
    clean: true,
    dts: true,
    splitting: false,
});
