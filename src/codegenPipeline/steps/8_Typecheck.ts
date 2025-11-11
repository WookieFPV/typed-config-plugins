import { stepLogger } from "../utils/logger";

const { logger, step } = stepLogger("Typecheck");

export const typecheck = step(async () => {
    const res = await Bun.$`tsc`.nothrow().quiet();
    if (res.exitCode !== 0) {
        logger.warn("failed with tsc errors:");
        logger.warn(res.text());
        return logger.fail("Typecheck failed");
    }
});
