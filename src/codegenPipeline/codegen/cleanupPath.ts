export const cleanupPath = (path: string): string => {
    return path.replaceAll("\\", "/").replace("/commonjs/", "/typescript/");
};
