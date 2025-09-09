import fsS from "node:fs";
import { getConfigPluginTypeCode } from "./codeTerminalOutput";
import type { Plugin } from "./types";
import { readExpoConfig } from "./utils/readExpoConfig.js";

/**
 * WIP/PoC/quick dirty script
 * CLI used to update the list of all npm packages with config-plugin
 * It tries to find the types for the config-plugin.
 * generates code which will be used to type the config plugins
 */
export const typeConfigPlugins = async () => {
    const config = readExpoConfig();
    if (!config) {
        console.log(
            "Unable to read Expo Config\n" +
                "Make sure your config is valid (run with --debug for more info)\n" +
                "npx list-config-plugins@latest --debug",
        );
        return;
    }

    const plugins = config?.exp.plugins ?? [];

    const pluginList = plugins.flatMap((plugin) => {
        const res = parseConfigPlugin(plugin);
        return res ? [res] : [];
    });

    console.log(await getConfigPluginTypeCode(pluginList));
};

// biome-ignore lint: lint/suspicious/noExplicitAny
export const parseConfigPlugin = (plugin: string | [] | [string] | [string, any]): Plugin | undefined => {
    if (typeof plugin === "string") {
        if (isLocalFile(plugin)) return;
        return { name: plugin, options: null };
    } else if (typeof plugin === "object" && plugin.length >= 1 && typeof plugin[0] === "string") {
        if (isLocalFile(plugin[0])) return;
        return { name: plugin[0], options: plugin[1] ?? null };
    }
    return { name: "unknown", options: { error: plugin } };
};

export const isLocalFile = (pluginName: string) => {
    try {
        const res = fsS.statfsSync(pluginName);
        return res.bsize > 0;
    } catch (_e) {
        return false;
    }
};
