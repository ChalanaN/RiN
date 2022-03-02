import { PageInfo, RiNCompilerOptions } from "./utils.js";
/**
 * Compiler for parsing custom HTML 🤖
 */
export default class RiNCompiler {
    /**  */
    AppView: string;
    Cache: {
        [x: string]: PageInfo;
    };
    CacheMaxAge: number;
    private Tags;
    /**
     * Creates a new compiler 🤖
     * @param {string} appView Path to the main view of the app. All other pages are compiled inside this view.
     * @param {RiNCompilerOptions} [options] Options for the compiler
     */
    constructor(appView: string, options?: RiNCompilerOptions);
    /**
     * Compiles the app 🔄
     * @param {string} page HTML cotent to be rendered
     * @returns {Promise<PageInfo>}
     */
    compile(page: string): Promise<PageInfo>;
    /**
     * Compiles a page
     * @param {string} page Content of the page
     * @returns {PageInfo}
     */
    renderPage(page: string): PageInfo;
}
