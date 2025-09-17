import type { RnDep } from "./types";

export const groupPromiseAllSettled = <In, Out extends In = In>(data: In[], settledResults: PromiseSettledResult<Out>[]) => {
    if (data.length !== settledResults.length) throw new Error("Data and settledResults must have the same length");

    const fulfilled = settledResults.filter((r): r is PromiseFulfilledResult<Out> => r.status === "fulfilled").map((r) => r.value);

    const rejected = settledResults
        .filter((r): r is PromiseRejectedResult => r.status === "rejected")
        .map((r, i) => ({
            input: data[i] as RnDep,
            reason: r.reason instanceof Error ? r.reason : Error(r.reason),
        }));

    return { fulfilled, rejected };
};
