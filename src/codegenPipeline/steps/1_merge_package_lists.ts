import { toMerged } from "es-toolkit";
import { cleanupGitHubUrl } from "../githubSearch/cleanupGitHubUrl";
import { jsonPersistorFactory } from "../storage/jsonFileHelper";
import { packageListFile } from "../storage/mainPackageList";
import { downloadFile } from "../utils/downloadFile";
import { stepLogger } from "../utils/logger";
import type { RnDep } from "../utils/types";

const URL = "https://raw.githubusercontent.com/react-native-community/directory/refs/heads/main/react-native-libraries.json";

const { step } = stepLogger("Update React-Native Directory Package List");

const inputFile = jsonPersistorFactory<RnDep>({
    primaryKey: "githubUrl",
    path: "src/codegenPipeline/data/input-rn-packages.json",
});

export const downloadAndMergeLists = step(async () => {
    await downloadFile(URL, inputFile.path);
    const newList = await inputFile.load();

    await packageListFile.update(
        newList.map((i) => toMerged(i, { origin: "directory", githubUrl: cleanupGitHubUrl(i.githubUrl) })),
        { override: false },
    );
});
