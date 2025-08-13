/**
 * Utility class for array operations.
 */
export class ArrayUtils {
    /**
     * Returns items in the first array that are not present in the second array.
     *
     * @param array The array to check for extra items.
     * @param expectedItems The array of expected items.
     * @param comparator Optional comparator function to compare items. If not provided, strict equality (===) is used.
     * @returns An array of items that are in the first array but not in the second array.
     */
    static getExtraItems<T>(array: readonly T[], expectedItems: readonly T[], comparator?: (a: T, b: T) => boolean): T[] {
        if (comparator !== undefined) {
            return array.filter((item) => !expectedItems.some((expectedItem) => comparator(item, expectedItem)));
        }
        return this.getUniqueItems(
            array.filter((item) => !expectedItems.includes(item)),
            comparator,
        );
    }

    /**
     * Returns items that are expected but missing from the first array.
     *
     * @param array The array to check for missing items.
     * @param expectedItems The array of expected items.
     * @param comparator Optional comparator function to compare items. If not provided, strict equality (===) is used.
     * @returns An array of items that are expected but not present in the first array.
     */
    static getMissingItems<T>(array: readonly T[], expectedItems: readonly T[], comparator?: (a: T, b: T) => boolean): T[] {
        return this.getExtraItems(expectedItems, array, comparator);
    }

    /**
     * Returns items that are present in both arrays.
     *
     * @param array1 The first array.
     * @param array2 The second array.
     * @param comparator Optional comparator function to compare items. If not provided, strict equality (===) is used.
     * @returns An array of items that are present in both arrays.
     */
    static getCommonItems<T>(array1: readonly T[], array2: readonly T[], comparator?: (a: T, b: T) => boolean): T[] {
        if (comparator !== undefined) {
            return array1.filter((item) => array2.some((expectedItem) => comparator(item, expectedItem)));
        }
        return array1.filter((item) => array2.includes(item));
    }

    /**
     * Returns a new array with unique items from the input array.
     *
     * @param array The input array.
     * @param comparator Optional comparator function to compare items. If not provided, strict equality (===) is used.
     * @returns A new array containing only unique items.
     */
    static getUniqueItems<T>(array: readonly T[], comparator?: (a: T, b: T) => boolean): T[] {
        if (comparator !== undefined) {
            const uniqueItems: T[] = [];
            for (const item of array) {
                if (!uniqueItems.some((uniqueItem) => comparator(item, uniqueItem))) {
                    uniqueItems.push(item);
                }
            }
            return uniqueItems;
        }
        return [...new Set(array)];
    }

    /**
     * Checks if two arrays are equal in terms of their items and order.
     *
     * @param array1 The first array.
     * @param array2 The second array.
     * @param comparator Optional comparator function to compare items. If not provided, strict equality (===) is used.
     * @returns True if both arrays are equal, false otherwise.
     */
    static areEqual<T>(array1: readonly T[], array2: readonly T[], comparator?: (a: T, b: T) => boolean): boolean {
        if (array1.length !== array2.length) {
            return false;
        }
        const areItemsEqual = comparator ?? ((a: T, b: T) => a === b);
        for (let i = 0; i < array1.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (!areItemsEqual(array1[i]!, array2[i]!)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if two arrays are equal in terms of their items, regardless of order.
     * Duplicates are handled, meaning that if an item appears multiple times in one array,
     * it must appear the same number of times in the other array.
     *
     * @param array1 The first array.
     * @param array2 The second array.
     * @param comparator Optional comparator function to compare items. If not provided, strict equality (===) is used.
     * @returns True if both arrays are equal, false otherwise.
     */
    static areEqualInAnyOrder<T>(array1: readonly T[], array2: readonly T[], comparator?: (a: T, b: T) => boolean): boolean {
        if (array1.length !== array2.length) {
            return false;
        }
        const areItemsEqual = comparator ?? ((a: T, b: T) => a === b);
        const array2MatchedIndexes = new Array(array2.length).fill(false);
        for (const value of array1) {
            const index = array2.findIndex((item, itemIndex) => areItemsEqual(item, value) && array2MatchedIndexes[itemIndex] !== true);
            if (index === -1) {
                return false;
            }
            array2MatchedIndexes[index] = true;
        }
        return true;
    }
}
