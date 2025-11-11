import pQueue from "p-queue";

export const npmQueue = new pQueue({
    concurrency: 20,
});
