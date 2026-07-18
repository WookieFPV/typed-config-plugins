import fs from "node:fs";
import path from "node:path";

export const readPackageJson = (npmPkg: string): Record<string, unknown> | undefined => {
    try {
        return JSON.parse(fs.readFileSync(path.join("node_modules", npmPkg, "package.json"), "utf8"));
    } catch {
        return undefined;
    }
};
