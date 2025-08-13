/**
 * Utility class for string operations.
 */
export class StringUtils {
    /**
     *  Converts the first letter of a string to lowercase.
     *
     * @param str The input string.
     * @returns The input string with the first letter converted to lowercase.
     */
    static lowerCaseFirstLetter<T extends string>(str: T): T {
        return (str.charAt(0).toLocaleLowerCase() + str.slice(1)) as T;
    }

    /**
     * Converts the first letter of a string to uppercase.
     *
     * @param str The input string.
     * @returns The input string with the first letter converted to uppercase.
     */
    static upperCaseFirstLetter<T extends string>(str: T): T {
        return (str.charAt(0).toLocaleUpperCase() + str.slice(1)) as T;
    }

    /**
     * Converts a camelCase string to a kebab-case string.
     *
     * @param str The input camelCase string.
     * @returns The converted kebab-case string.
     */
    static camelCaseToKebabCase<T extends string>(str: T): T {
        return str.replace(/[A-Z]/gu, (match) => `-${match.toLocaleLowerCase()}`) as T;
    }

    /**
     * Converts a kebab-case string to a camelCase string.
     *
     * @param str The input kebab-case string.
     * @returns The converted camelCase string.
     */
    static kebabCaseToCamelCase<T extends string>(str: T): T {
        return str.replace(/-+(?<word>[a-z])/gu, (_match, word: string) => word.toLocaleUpperCase()) as T;
    }

    /**
     * Converts a PascalCase string to a kebab-case string.
     *
     * @param str The input PascalCase string.
     * @returns The converted kebab-case string.
     */
    static pascalCaseToKebabCase<T extends string>(str: T): T {
        return this.camelCaseToKebabCase(this.lowerCaseFirstLetter(str));
    }

    /**
     * Converts a kebab-case string to a PascalCase string.
     *
     * @param str The input kebab-case string.
     * @returns The converted PascalCase string.
     */
    static kebabCaseToPascalCase<T extends string>(str: T): T {
        return this.upperCaseFirstLetter(this.kebabCaseToCamelCase(str));
    }
}
