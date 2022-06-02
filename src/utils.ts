import { PathLike } from "fs"
import { readdir, stat } from "fs/promises"
import { resolve } from "path"

export interface Types {
    undefined: undefined,
    object: object,
    boolean: boolean,
    number: number,
    bigint: bigint,
    string: string,
    symbol: symbol
}

export type TokenList<T, K extends string = string> = {
    [x in K]: T
}

export const asType = <M>() => <T extends M>(a: T): T => a

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

/**
 * Returns the object without parameters which has a value of `null` or `undefined`
 */
export function removeUndefined<T extends {}>(o: T): T {
    return Object.keys(o).forEach(k => o[k] ?? delete o[k]) as undefined || o
}

/**
 * Returns the passed value if it's type is the expected type. Otherwise, returns `undefined`
 * @param v Value to check
 * @param t Expected type
 */
export function singleTypeOnly<T extends keyof Types>(v: any, t: T): Types[T] | undefined {
    return (t == typeof v && v)
}

export function debounce(cb: (...args: any) => void, delay = 1000) {
    let timeout: NodeJS.Timeout

    return (...args: any) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

export async function getAllFiles(directory: string) {
    let filesAndDirectories = (await readdir(directory)).map(filename => resolve(directory, filename)),
        files: string[] = []

    await Promise.all(filesAndDirectories.map(async pathname => {
        if ((await stat(pathname)).isDirectory()) {
            try {
                files = files.concat(await getAllFiles(resolve(directory, pathname)))
            } catch { }
        } else {
            files.push(pathname)
        }
    }))

    files = files.sort()
    return files
}