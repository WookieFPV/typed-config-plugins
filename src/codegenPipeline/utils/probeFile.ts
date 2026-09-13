import { delay } from "es-toolkit/promise";

/**
 * Result of a "does this file exist?" probe.
 * `true`/`false` are definitive answers; a string carries the reason the probe was inconclusive
 * (so callers can log it and retry the package on the next run instead of recording a wrong answer).
 */
export type FileProbeResult = { hasFile: boolean | string; url: string };

/**
 * Maps a response to a definitive probe result, or `undefined` for "transient - retry".
 * Transient failures on the last attempt fall back to the response's status text.
 */
type ClassifyResponse = (response: Response) => boolean | string | undefined;

const backoff = (attempt: number) => delay(2 ** attempt * 500);

/**
 * HEAD/GETs `url` and classifies the response, retrying transient failures with exponential backoff.
 *
 * A thrown `fetch` (DNS failure, timeout, connection reset) is treated exactly like a transient
 * status rather than being allowed to escape - these probes run inside concurrency batches, where
 * a single rejection would abort every other package in the batch.
 */
export const probeFile = async (url: string, classify: ClassifyResponse, { init, retries = 3 }: { init?: RequestInit; retries?: number } = {}): Promise<FileProbeResult> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
        const isLastAttempt = attempt === retries;
        try {
            const response = await fetch(url, init);
            const result = classify(response);
            if (result !== undefined) return { hasFile: result, url };
            if (isLastAttempt) return { hasFile: response.statusText, url };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (isLastAttempt) return { hasFile: `fetch failed: ${message}`, url };
        }
        await backoff(attempt);
    }
    // unreachable, satisfies TS
    return { hasFile: "unknown", url };
};
