import { getConfig } from "@expo/config";

export const readExpoConfig = () => {
    try {
        return getConfig(process.cwd(), { skipSDKVersionRequirement: true });
    } catch (e) {
        console.warn(`Error while reading config file:\n"${e instanceof Error ? e.message : ""}"\n`);
        console.warn(e);
        return null;
    }
};
