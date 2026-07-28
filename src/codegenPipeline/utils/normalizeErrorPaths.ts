// `types.error` in `data/rn-packages.json` is a checked-in TypeScript diagnostic, and those
// diagnostics embed absolute file paths ("'/home/runner/work/.../node_modules/pkg/app.plugin.js'
// implicitly has an 'any' type"). The absolute prefix depends on where the pipeline happened to
// run, so the exact same package produced a different committed line on CI than on a contributor's
// machine - an endless stream of phantom diff noise. Rewriting every absolute path to a stable,
// machine-independent form keeps the generated file byte-identical no matter who generates it.

const toPosix = (value: string) => value.replaceAll("\\", "/");

const projectRoot = toPosix(process.cwd()).replace(/\/+$/, "");

// Matches absolute paths only (leading separator, or a Windows drive letter), with at least two
// segments. The lookbehind keeps bare module specifiers out of it - the `/app.plugin` inside
// `module 'expo-foo/app.plugin'` is already machine-independent and must stay untouched.
const ABSOLUTE_PATH = /(?<![\w.$@+~-])(?:[A-Za-z]:)?[\\/](?:[\w.$@+~-]+[\\/])+[\w.$@+~-]+/g;

const normalizePath = (match: string): string => {
    const posixPath = toPosix(match);

    // Everything the checker complains about lives in `node_modules`, and where that directory
    // sits (repo root on CI, a different repo root locally, a hoisted parent dir) is exactly the
    // part that varies - so anchor on it and drop whatever came before.
    const nodeModulesIndex = posixPath.lastIndexOf("/node_modules/");
    if (nodeModulesIndex !== -1) return posixPath.slice(nodeModulesIndex + 1);

    if (posixPath.startsWith(`${projectRoot}/`)) return posixPath.slice(projectRoot.length + 1);

    // Something outside the repo entirely (a global toolchain/cache dir, e.g. TypeScript's bundled
    // libs). Its directory is unreproducible by definition, the file name is not.
    return posixPath.split("/").pop() ?? posixPath;
};

/** Rewrites absolute paths inside a message so it is identical on every machine (local, other contributors, CI). */
export const normalizeErrorPaths = (message: string): string => message.replace(ABSOLUTE_PATH, normalizePath);
