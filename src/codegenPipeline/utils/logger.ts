import ora from "ora";

let stepCount = 1;

type LastLine = "ora" | "log" | null;

export const stepLogger = (stepName?: string) => {
    let lastLine: LastLine = null;

    const spinner = ora();

    const pre = () => (lastLine === "ora" ? "" : "\n");

    const start = (message = stepName) => {
        if (lastLine === "log") process.stdout.write("\n");
        spinner.start(`[Step ${stepCount}]▶️ ${message}`);
        lastLine = "ora";
    };

    const log = (...message: unknown[]) => {
        if (lastLine === "ora") spinner.stopAndPersist();
        process.stdout.write(`${pre()}  [Step ${stepCount}]  ${message.join(" ")}`);
        lastLine = "log";
    };

    const warn = (...message: unknown[]) => {
        if (lastLine === "ora") spinner.stopAndPersist();
        process.stdout.write(`${pre()}  [Step ${stepCount}]⚠️  ${message.join(" ")}`);
        lastLine = "log";
    };

    const finish = (message = stepName) => {
        if (lastLine === "log") process.stdout.write("\n");
        spinner.succeed(`[Step ${stepCount++}]  ${message}`);
        lastLine = "ora";
    };

    const fail = (message = stepName) => {
        if (lastLine === "log") process.stdout.write("\n");
        spinner.fail(`[Step ${stepCount++}]  ${message}`);
        lastLine = "ora";
    };

    return { logger: { start, log, warn, finish, fail }, spinner };
};

export const promiseStep = async <T>(promise: Promise<T>, stepName: string) => {
    const { logger } = stepLogger(stepName);
    try {
        logger.start();
        const data = await promise;
        logger.finish();
        return data;
    } catch (e) {
        logger.fail();
        throw e;
    }
};
