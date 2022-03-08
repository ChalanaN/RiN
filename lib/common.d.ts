/** Error codes used in {@link RiN} */
export declare const ERRORS: {
    COMPILER_NOT_READY: string;
    MAIN_VIEW_NOT_FOUND: string;
    FILE_NOT_FOUND: string;
    UNCAUGHT: string;
    Widgets: {
        File: {
            FILE_NOT_FOUND: string;
        };
    };
};
/** Compiler defaults */
export declare const DEFAULTS: {
    REGEXPS_FOR_TAGS: {
        [x: string]: RegExp;
    };
    COMPILER_OPTIONS: RiNCompilerOptions;
};
/**
 * Options for the {@link RiNCompiler} 🔄
 */
export interface RiNCompilerOptions {
    /** Default title of the app */
    title?: string;
    /**
     * Minify the file?
     * @default true
     */
    minify?: boolean;
    /**
     * Max age of cached pages in milliseconds
     * @default 60000
     */
    CacheMaxAge?: number;
    /**
     * Can be accessible in the HTML file through the `App` tags
     *
     * As an example, if you are passing the value `{ AppWidgets: { Time: Date.now() } }` as the options parameter of RiNCompiler, you can access it in your HTML by using the `<App.Time/>` tag.
     */
    AppWidgets?: {
        [x: string]: any;
    };
    /**
     * Run JavaScript inside your HTML.
     */
    FunctionalWidgets?: {
        [x: string]: (value: string, App: PageInfo) => string;
    };
}
export interface RiNOptions extends RiNCompilerOptions {
    /** Path to the out directory. Will be created if doesn't exist. */
    outDir: string;
}
/**
 * Information about a page 📃
 */
export interface PageInfo {
    /** Title of the page */
    title: string;
    /** HTML content of the page */
    html: string;
    /**
     * Imported CSS and JS files. They are automatically added to the HTML content.
     */
    imports?: {
        /**
         * Imported JS files as an array of script sources
         * @example [ "./js/main.js", "./js/index.min.js" ]
         */
        js: string[];
        /**
         * Imported CSS files as an array of stylesheet sources
         * @example [ "./css/main.css", "./css/index.min.css" ]
         */
        css: string[];
        /**
         * `<script>` tags to use inside HTML. They implicitly have the class "imports"
         * @example <script src="./js/main.js" class="imports"></script><script src="./js/index.min.js" class="imports"></script>
         */
        jsTags: string;
        /**
         * `<link>` tags to use inside HTML. They implicitly have the class "imports"
         * @example <link rel="stylesheet" href="./css/main.css" class="imports"><link rel="stylesheet" src="./css/index.min.css" class="imports">
         */
        cssTags: string;
    };
    /**
     * `false` if the response is a cached page.
     * Refer to {@link cachedAt}  for the time the page has been cached.
     */
    readonly fresh?: boolean;
    /**
     * Timestamp of when the page has been cached.
     */
    readonly cachedAt?: number;
    /** Additional properties of the page */
    [x: string]: any;
}
export interface Component {
    /** HTML content of the component */
    html: string;
    /**
     * `false` if the response is a cached component.
     * Refer to {@link cachedAt}  for the time the component has been cached.
     */
    readonly fresh?: boolean;
    /**
     * Timestamp of when the component has been cached.
     */
    readonly cachedAt?: number;
    /** Additional properties of the page */
    [x: string]: any;
}
