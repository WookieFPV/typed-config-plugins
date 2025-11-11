import { json } from "npm-registry-fetch";
import { npmQueue } from "./npmQueue";

/**
 * Checks if an npm package exists in the registry.
 *
 * @param {string} packageName The name of the package to check (e.g., 'express', '@angular/core').
 * @param throwOnError
 * @returns {Promise<boolean>} A promise that resolves to `true` if the package exists, `false` otherwise.
 */
export const npmPackageExists = async (packageName: string, throwOnError = false): Promise<boolean> =>
    npmQueue.add(async () => {
        try {
            await json(packageName, { fullMetadata: false });
            return true;
            // biome-ignore lint/suspicious/noExplicitAny: ...
        } catch (error: any) {
            if (throwOnError) throw error;
            if (error?.code === "E404") return false;
            console.error(`Error checking package "${packageName}":`, error.message);
            return false;
        }
    });
