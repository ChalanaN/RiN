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