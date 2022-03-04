import { EventEmitter } from "events";
import { readFile } from "fs/promises";
import { dirname, resolve } from "path";
import { DEFAULTS, ERRORS, minifyHtml, PageInfo, RiNCompilerOptions } from "./utils.js";

/**
 * Compiler for parsing custom HTML 🤖
 * 
 * @author ChalanaN <wchalanaw@gmail.com>
 */
export default class RiNCompiler extends EventEmitter {
    /** Main view of the app */
    readonly AppView: string;
    options: RiNCompilerOptions;

    /** Pages cached by the compiler */
    readonly Cache: { [x: string]: PageInfo };

    /** Regular Expressions used for searching tags. DO NOT EDIT THIS UNTIL YOU KNOW WHAT YOU ARE DOING */
    private TAGS: typeof DEFAULTS.REGEXPS_FOR_TAGS;

    /**
     * Creates a new compiler 🤖
     * @param {string} appView Path to the main view of the app. All other pages are compiled inside this view.
     * @param {RiNCompilerOptions} [options] Options for the compiler
     */
    constructor(appView: string, options?: RiNCompilerOptions) {
        super();

        this.TAGS = DEFAULTS.REGEXPS_FOR_TAGS

        this.AppView = appView
        this.options = { ...DEFAULTS.COMPILER_OPTIONS, ...options }
        this.Cache = {}

        // Cache the main view
        ;(async () => {
            try {
                this.Cache.App = { title: options?.title, html: (await readFile(this.AppView)).toString(), cachedAt: Date.now() }
            } catch { return this.emit("error", new Error(ERRORS.MAIN_VIEW_NOT_FOUND)) }
            this.emit("ready")
        })()
    }

    /**
     * Compiles the app 🔄
     * @param {string} page HTML cotent to be rendered
     * @param {string} rootDir Root directory of the content. This is used for the `<File/>` widget.
     * @returns {Promise<PageInfo>}
     */
    compile(page: string, rootDir?: string): Promise<PageInfo> {
        // ⭕ TODO ⭕ Instead of throwing an error, consider waiting for the compiler to load
        if (!this.Cache.App) throw new Error(ERRORS.COMPILER_NOT_READY)

        return new Promise(async (res) => {
            // Check cache
            if (this.Cache?.[page] && (Date.now() - this.Cache[page].cachedAt) < this.options.CacheMaxAge) return res(this.Cache[page])

            var { html: Page, title: Title, imports: Imports, ...additionalProperties } = this.renderPage(page)
            var App = { html: this.Cache.App.html, Page, Title, Imports, ...additionalProperties, ...this.options.AppWidgets, ...this.options.FunctionalWidgets }

            /* Widgets 🤖 */ {
                var iterator: IterableIterator<RegExpMatchArray>, i: IteratorResult<RegExpMatchArray, any>

                // App Widgets 🤖
                iterator = App.html.matchAll(this.TAGS.appWidgets)
                do {
                    i = iterator.next()
                    !i.done && (App.html = App.html.replace(i.value[0], App[i.value[1]]))
                } while (!i.done)
                
                // Functional Widjets 🤖
                iterator = App.html.matchAll(this.TAGS.functionalWidgets)
                do {
                    i = iterator.next()
                    !i.done && (App.html = App.html.replace(i.value[0], App[i.value[1]]?.(i.value[2])))
                } while (!i.done)

                // Files 🤖
                iterator = App.html.matchAll(this.TAGS.files)
                try {
                    do {
                        i = iterator.next()
                        !i.done && (App.html = App.html.replace(i.value[0], (await readFile(resolve(rootDir || "", i.value[1]))).toString()))
                    } while (!i.done)
                } catch (err) { throw new Error(ERRORS.Widgets.File.FILE_NOT_FOUND.concat("\n", err)) }
            }

            // Minify the file if specified
            this.options.minify && (App.html = minifyHtml(App.html))
            // Cache the compiled page
            this.Cache[page] = { cachedAt: Date.now(), fresh: false, html: App.html, title: App.Title, imports: App.Imports }

            res({ html: App.html, title: App.Title, imports: App.Imports })
        })
    }

    /**
     * Compiles a page
     * @param {string} page Content of the page
     * @returns {PageInfo}
     */
    renderPage(page: string): PageInfo {
        var Page: PageInfo = {
            title: this.options.title,
            imports: { js: [], css: [], jsTags: "", cssTags: "" },
            html: page
        }

        /* Setting Tags 🤖 */ {
            var iterator: IterableIterator<RegExpMatchArray>, i: IteratorResult<RegExpMatchArray, any>

            // Settings 🤖
            iterator = page.matchAll(this.TAGS.settings)
            do {
                i = iterator.next()
                !i.done && (Page[i.value[2]] = i.value[3])
            } while (!i.done)

            // Imports 📲
            iterator = page.matchAll(this.TAGS.imports)
            do {
                i = iterator.next()
                !i.done && Page.imports[i.value[1]].push(i.value[2])
            } while (!i.done)
        }

        Page.imports.cssTags = Page.imports.css.map(url => `<link rel="stylesheet" href="${url}" class="imports">`).join("")
        Page.imports.jsTags = Page.imports.js.map(url => `<script src="${url}" class="imports"></script>`).join("")

        Page.html = page
        return Page
    }
}