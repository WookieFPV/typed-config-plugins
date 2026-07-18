import { stepLogger } from "../utils/logger";

const { logger, step } = stepLogger("Typecheck");

export const typecheck = step(async () => {
    const res = await Bun.$`tsc`.nothrow().quiet();
    if (res.exitCode !== 0) {
        logger.warn("failed with tsc errors:");
        logger.warn(res.text());
        // Throw (rather than just logging) so a broken generated file fails the run instead of
        // silently producing a PR that only fails later in CI.
        throw new Error("Typecheck failed after codegen - see tsc output above.");
    }
});
