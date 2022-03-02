/** Error codes used in {@link RiN} */
export const ERRORS = {
    MAIN_VIEW_NOT_FOUND: "Couldn't find the main view of the app 😕",
    FILE_NOT_FOUND: "Couldn't find the file 👀"
};
/**
 * Minify HTML 🗜
 * @param {string} html HTML to be minified
 * @returns Minified HTML
 */
export const minifyHtml = (html) => html.replace(/(\<\!--.*--\>|\r\n|\r|\n|\s{4})/gm, "").replace(/\/\/newLine/g, "\n").trim();
//# sourceMappingURL=utils.js.map