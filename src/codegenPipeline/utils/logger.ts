import ora from "ora";

let stepCount = 1;

type LastLine = "ora" | "log" | null;

export const stepLogger = (stepName?: string) => {
    let lastLine: LastLine = null;

    const index = () => `[${stepCount}]`;

    const spinner = ora();

    // Keep a blank line between a finished spinner and the plain lines that follow it, but not
    // between consecutive plain lines.
    const pre = () => (lastLine === "ora" ? "" : "\n");

    const start = (message = stepName) => {
        if (lastLine === "log") process.stdout.write("\n");
        spinner.start(`${index()} ️ ${message}`);
        lastLine = "ora";
    };

    const write = (prefix: string, message: unknown[]) => {
        if (lastLine === "ora") spinner.stopAndPersist();
        process.stdout.write(`${pre()}  ${index()}${prefix}${message.join(" ")}`);
        lastLine = "log";
    };

    const log = (...message: unknown[]) => write("  ", message);
    const warn = (...message: unknown[]) => write("⚠️  ", message);

    const end = (outcome: "succeed" | "fail", message = stepName) => {
        if (lastLine === "log") process.stdout.write("\n");
        spinner[outcome](`${index()}  ${message}`);
        stepCount++;
        lastLine = "ora";
    };

    const finish = (message?: string) => end("succeed", message);
    const fail = (message?: string) => end("fail", message);

    const step = <A extends unknown[], T>(fn: (...args: A) => Promise<T>) => {
        return async (...args: A): Promise<T> => {
            start();
            try {
                const data = await fn(...args);
                finish();
                return data;
            } catch (e) {
                fail();
                throw e;
            }
        };
    };

    return { logger: { start, log, warn, finish, fail }, step };
};

export const promiseStep = async <T>(promise: Promise<T>, stepName: string) => {
    const { step } = stepLogger(stepName);
    return step(async () => promise)();
};
