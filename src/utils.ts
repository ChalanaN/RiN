import RiN from "."
import RiNCompiler from "./compiler.js"

/** Error codes used in {@link RiN} */
export const ERRORS = {
    MAIN_VIEW_NOT_FOUND: "Couldn't find the main view of the app 😕",
    FILE_NOT_FOUND: "Couldn't find the file 👀"
}

/**
 * Minify HTML 🗜
 * @param {string} html HTML to be minified
 * @returns Minified HTML
 */
export const minifyHtml = (html: string): string => html.replace(/(\<\!--.*--\>|\r\n|\r|\n|\s{4})/gm, "").replace(/\/\/newLine/g, "\n").trim()

/**
 * Options for the {@link RiNCompiler} 🔄
 */
export interface RiNCompilerOptions {
    /** Default title of the app */
    title: string,

    /**
     * Minify the file?
     * @default true
     */
    minify: boolean,

    /** Can be accessible in the HTML file through the `App` tags */
    [x:string]: any
}

export interface RiNOptions extends RiNCompilerOptions {
    /** Path to the out directory. Will be created if doesn't exist. */
    outDir: string
}

/**
 * Information about a page 📃
 */
export interface PageInfo {
    /** Title of the page */
    title: string,

    /**
     * HTML content of the page
     */
    html: string,

    /**
     * Imported CSS and JS files. They are automatically added to the HTML content.
     */
    imports?: {
        /**
         * Imported JS files as an array of script sources
         * @example [ "./js/main.js", "./js/index.min.js" ]
         */
        js: string[],
        /**
         * Imported CSS files as an array of stylesheet sources
         * @example [ "./css/main.css", "./css/index.min.css" ]
         */
        css: string[],
        /**
         * `<script>` tags to use inside HTML. They implicitly have the class "imports"
         * @example <script src="./js/main.js" class="imports"></script><script src="./js/index.min.js" class="imports"></script>
         */
        jsTags: string,
        /**
         * `<link>` tags to use inside HTML. They implicitly have the class "imports"
         * @example <link rel="stylesheet" href="./css/main.css" class="imports"><link rel="stylesheet" src="./css/index.min.css" class="imports">
         */
        cssTags: string
    },

    /**
     * `false` if the response is a cached page.
     * Refer to {@link cachedAt}  for the time the page has been cached.
     */
    fresh?: boolean,

    /**
     * Timestamp of when the page has been cached.
     */
    cachedAt?: number
}