/**
 * Minify HTML 🗜
 * @param {string} html HTML to be minified
 * @returns Minified HTML
 */
export declare const minifyHtml: (html: string) => string;
/**
 * Parse attributes from a string with the format of [attribute]="[value]"
 * @param s Attributes
 * @returns Attributes parsed into an object
 */
export declare const parseAttributes: (s: string) => {
    [x: string]: string;
};
