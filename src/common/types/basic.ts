/**
 * Represents a constructor type that can be used to create instances of a specific type.
 *
 * @template T - The type of the instances created by the constructor.
 */
export type Constructor<T extends object = object> = new (...args: any[]) => T; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Represents a constructor type that implements a specific interface.
 *
 * @template TConstructor - The constructor type that extends the base Constructor.
 * @template TInterface - The interface that the constructor implements.
 */
export type ConstructorWithInterface<TConstructor extends Constructor, TInterface extends object> = TConstructor & Constructor<TInterface>;

/**
 * Wrapper for primitive types to prevent accidental wrong assignments.
 *
 * @template TPrimary - The primary type that is being wrapped.
 * @template TUnique - A unique symbol to differentiate this opaque type from others.
 *
 * @example
 * ```ts
 * type MyString = Opaque<string, typeof _MyString>;
 * declare const _MyString: unique symbol;
 * ```
 */
export type Opaque<TPrimary, TUnique extends symbol> = TPrimary & {
    /**
     * Unique symbol to differentiate this opaque type from others.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _type?: TUnique;
};

/**
 * Wrapper for primitive types to prevent accidental wrong assignments.
 * This version is stricter than {@link Opaque} as it does not allow assignment of TPrimary directly (explicit "as ..." is required).
 *
 * @template TPrimary - The primary type that is being wrapped.
 * @template TUnique - A unique symbol to differentiate this opaque type from others.
 *
 * @example
 * ```ts
 * type MyString = OpaqueStrict<string, typeof _MyString>;
 * declare const _MyString: unique symbol;
 * ```
 */
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export type OpaqueStrict<TPrimary, TUnique extends symbol> = TPrimary & { [P in TUnique]: never };

/**
 * Generates a union type of natural numbers from 0 to TLength - 1.
 *
 * @template TLength - The length of the natural numbers to generate.
 * @template TAcc - Accumulator type used to build the union type recursively.
 */
export type NaturalNumbers<TLength extends number, TAcc extends number[] = []> = TAcc["length"] extends TLength ? TAcc[number] : NaturalNumbers<TLength, [...TAcc, TAcc["length"]]>;

/**
 * Generates a union type of natural numbers from TFirst to TLast inclusive.
 *
 * @template TFirst - The first natural number in the range (inclusive).
 * @template TLast - The last natural number in the range (inclusive).
 */
export type IntRangeInclusive<TFirst extends number, TLast extends number> = Exclude<NaturalNumbers<TLast>, NaturalNumbers<TFirst>> | TLast;
