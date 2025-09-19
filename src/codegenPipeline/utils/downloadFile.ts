import * as path from "node:path";

export async function downloadFile(url: string, ...outputPath: string[]) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`❌ Failed to download: ${res.status} ${res.statusText}`);

    const outdir = path.join(...outputPath);
    await Bun.write(outdir, res);
    return outdir;
}
