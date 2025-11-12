export async function downloadFile(url: string, targetFile: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`❌ Failed to download: ${res.status} ${res.statusText}`);

    await Bun.write(targetFile, res);
    return targetFile;
}
