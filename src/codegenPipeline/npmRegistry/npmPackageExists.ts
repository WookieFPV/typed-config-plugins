import { json } from "npm-registry-fetch";
import { npmQueue } from "./npmQueue";

/**
 * Checks if an npm package exists in the registry.
 *
 * Takes exactly one argument so it can be passed straight to `mapAsync`/`filterAsync` (which call
 * their callback with `(item, index)`) without the index being read as a second parameter.
 *
 * @param packageName The name of the package to check (e.g., 'express', '@angular/core').
 * @returns `true` if the package exists, `false` otherwise (including on an unexpected error).
 */
export const npmPackageExists = async (packageName: string): Promise<boolean> =>
    npmQueue.add(async () => {
        try {
            await json(packageName, { fullMetadata: false });
            return true;
        } catch (error) {
            if ((error as { code?: string } | null)?.code === "E404") return false;
            console.error(`Error checking package "${packageName}":`, error instanceof Error ? error.message : error);
            return false;
        }
    });
