import { downloadFile } from "../utils/downloadFile";
import { stepLogger } from "../utils/logger";
import { mergePackageLists, packageListFile } from "../utils/packageListJson";

const URL = "https://raw.githubusercontent.com/react-native-community/directory/refs/heads/main/react-native-libraries.json";

const { logger } = stepLogger("Update React-Native Directory Package List");

export const downloadAndMergeLists = async (): Promise<void> => {
    logger.start();
    const filePath = await downloadFile(URL, "src", "codegenPipeline", "data", "input-rn-packages.json");

    // Remove Unused Parameter by loading & saving the file (filtering is done on save)
    const { load, save } = packageListFile(filePath);
    await save(await load("all"));

    await mergePackageLists(filePath);

    logger.finish();
};
