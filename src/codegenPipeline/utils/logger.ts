import ora from "ora";

let stepCount = 1;

type LastLine = "ora" | "log" | null;

export const stepLogger = (stepName?: string) => {
    let lastLine: LastLine = null;

    const index = () => `[${stepCount.toString().padStart(1, " ")}]`;

    const spinner = ora();

    const pre = () => (lastLine === "ora" ? "" : "\n");

    const start = (message = stepName) => {
        if (lastLine === "log") process.stdout.write("\n");
        spinner.start(`${index()} ️ ${message}`);
        lastLine = "ora";
    };

    const log = (...message: unknown[]) => {
        if (lastLine === "ora") spinner.stopAndPersist();
        process.stdout.write(`${pre()}  ${index()}  ${message.join(" ")}`);
        lastLine = "log";
    };

    const warn = (...message: unknown[]) => {
        if (lastLine === "ora") spinner.stopAndPersist();
        process.stdout.write(`${pre()}  ${index()}⚠️  ${message.join(" ")}`);
        lastLine = "log";
    };

    const finish = (message = stepName) => {
        if (lastLine === "log") process.stdout.write("\n");
        spinner.succeed(`${index()}  ${message}`);
        stepCount++;
        lastLine = "ora";
    };

    const fail = (message = stepName) => {
        if (lastLine === "log") process.stdout.write("\n");
        spinner.fail(`${index()}  ${message}`);
        stepCount++;
        lastLine = "ora";
    };

    const progressText = (message: string) => {
        if (lastLine === "log") process.stdout.write("\n") && spinner.start();
        spinner.text = `${index()}  ${message}`;
        lastLine = "ora";
    };

    const step = <A extends unknown[], T>(fn: (...args: A) => Promise<T>) => {
        return async (...args: A): Promise<T> => {
            try {
                start();
                const data = await fn(...args);
                finish();
                return data;
            } catch (e) {
                fail();
                throw e;
            }
        };
    };

    return { logger: { start, log, warn, finish, fail, progressText }, step, spinner };
};

export const promiseStep = async <T>(promise: Promise<T>, stepName: string) => {
    const { step } = stepLogger(stepName);
    return step(async () => promise)();
};
