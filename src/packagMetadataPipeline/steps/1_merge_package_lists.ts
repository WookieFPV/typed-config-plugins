import { downloadFile } from "../utils/downloadFile";
import { stepLogger } from "../utils/logger";
import { mergePackageLists } from "../utils/packageListJson";

const URL = "https://raw.githubusercontent.com/react-native-community/directory/refs/heads/main/react-native-libraries.json";

const logger = stepLogger("download and merge Lists");

export const downloadAndMergeLists = async (): Promise<void> => {
    logger.start();
    const path = await downloadFile(URL, "0_rn-packages.json");

    await mergePackageLists(path);

    logger.finish();
};
