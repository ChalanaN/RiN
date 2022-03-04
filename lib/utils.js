/** Error codes used in {@link RiN} */
export const ERRORS = {
    COMPILER_NOT_READY: "Compiler is not ready yet, please listen for the 'ready' event",
    MAIN_VIEW_NOT_FOUND: "Couldn't find the main view of the app 😕",
    FILE_NOT_FOUND: "Couldn't find the file 👀",
    UNCOUGHT: "An uncought error occured 😟",
    Widgets: {
        File: {
            FILE_NOT_FOUND: "File accessed through the <File/> widjet could not be accessed."
        }
    }
};
/** Compiler defaults */
export const DEFAULTS = {
    /** Regular Expressions used to find tags */
    REGEXPS_FOR_TAGS: {
        settings: /(?:<!--|\/\*).*<(Page\.([\w\.]*))>(.*)<\/Page.[\w\.]*>.*(?:-->|\*\/)/g,
        appWidgets: /(?:<!--|\/\*).*<App\.([\w\.]*)\/>.*(?:-->|\*\/)/g,
        functionalWidgets: /(?:<!--|\/\*).*<App\.([\w\.]*)>(.*)<\/App.[\w\.]*>.*(?:-->|\*\/)/g,
        files: /(?:<!--|\/\*).*<File:([\w\.\/]*)\/>.*(?:-->|\*\/)/g,
        imports: /(?:<!--|\/\*).*@Import (JS|CSS) \((.*)\).*(?:-->|\*\/)/g
    },
    /** Defaults for options of {@link RiNCompiler} */
    COMPILER_OPTIONS: {
        title: "Untitled",
        minify: true,
        AppWidgets: {},
        FunctionalWidgets: { Run: eval },
        CacheMaxAge: 60000
    }
};
/**
 * Minify HTML 🗜
 * @param {string} html HTML to be minified
 * @returns Minified HTML
 */
export const minifyHtml = (html) => html.replace(/(\<\!--.*--\>|\r\n|\r|\n|\s{4})/gm, "").replace(/\/\/newLine/g, "\n").trim();
//# sourceMappingURL=utils.js.map