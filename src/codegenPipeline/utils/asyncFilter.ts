/**
 * Asynchronously filters an array based on an async predicate function.
 *
 * @template T The type of elements in the array.
 * @param {T[]} array The array to filter.
 * @param {(item: T, index: number, array: T[]) => Promise<boolean>} asyncPredicate
 *   An async function that returns a Promise<boolean> for each item.
 * @returns {Promise<T[]>} A promise that resolves to the filtered array.
 */
export async function asyncFilter<T>(array: T[], asyncPredicate: (item: T, index: number, array: T[]) => Promise<boolean>): Promise<T[]> {
    const results = await Promise.all(array.map(asyncPredicate));

    return array.filter((_item, index) => results[index]);
}
