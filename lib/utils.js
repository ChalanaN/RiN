/**
 * Minify HTML 🗜
 * @param {string} html HTML to be minified
 * @returns Minified HTML
 */
export const minifyHtml = (html) => html.replace(/(\<\!--.*--\>|\r\n|\r|\n|\s{4})/gm, "").replace(/\/\/newLine/g, "\n").trim();
/**
 * Parse attributes from a string with the format of [attribute]="[value]"
 * @param s Attributes
 * @returns Attributes parsed into an object
 */
export const parseAttributes = (s) => {
    var attributes = {}, matches = s.matchAll(/(?<name>\b\w+\b)(?:\s*=\s*(?:"(?<value>[^"]*)")+)?/g), i;
    do {
        i = matches.next();
        !i.done && (attributes[i.value.groups.name] = i.value.groups.value || true);
    } while (!i.done);
    return attributes;
};
//# sourceMappingURL=utils.js.map