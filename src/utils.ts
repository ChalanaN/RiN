export interface Types {
    undefined: undefined,
    object: object,
    boolean: boolean,
    number: number,
    bigint: bigint,
    string: string,
    symbol: symbol
}

export type TokenList<T> = { [x: string]: T }

/**
 * Minify HTML 🗜
 * @param {string} html HTML to be minified
 * @returns Minified HTML
 */
export const minifyHtml = (html: string): string => html.replace(/(\<\!--.*--\>|\r\n|\r|\n|\s{4})/gm, "").replace(/\/\/newLine/g, "\n").trim()

/**
 * Parse attributes from a string with the format of [attribute]="[value]"
 * @param s Attributes
 * @returns Attributes parsed into an object
 */
export const parseAttributes = (s: string): { [x: string]: string } => {
    var attributes: { [x: string]: string } = {},
        matches = s.matchAll(/(?<name>\b\w+\b)(?:\s*=\s*(?:"(?<value>[^"]*)")+)?/g), i: IteratorResult<RegExpMatchArray, any>

    do {
        i = matches.next()
        !i.done && (attributes[i.value.groups.name] = i.value.groups.value || true)
    } while (!i.done)

    return attributes
}

/**
 * Modifies a number to the given length
 */
export const numFormat = (n: number, intLength?: number, decimalLength: number = 0): string => {
    let [ intPart, decimalPart ] = (n.toString().includes(".") ? n : n.toFixed(1)).toString().split(".")

    intPart.length < intLength && (intPart = "0".repeat(intLength - intPart.length) + intPart)

    decimalPart.length < decimalLength && (decimalPart = decimalPart + "0".repeat(decimalLength - decimalPart.length))
    decimalPart.length > decimalLength && (decimalPart = decimalPart.substring(0, decimalLength))

    return decimalPart ? `${intPart}.${decimalPart}` : intPart
}

export function removeUndefined(o: object) {
    // @ts-ignore
    return Object.keys(o).forEach(k => o[k] ?? delete o[k]) || o
}

/**
 * Returns the passed value if it's type is the expected type. Otherwise, returns `undefined`
 * @param v Value to check
 * @param t Expected type
 */
export function singleTypeOnly<T extends keyof Types>(v: any, t: T): Types[T] | undefined {
    return (t == typeof v && v)
}