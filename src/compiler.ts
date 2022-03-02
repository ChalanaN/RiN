import { readFile } from "fs/promises";
import { minifyHtml, PageInfo, RiNCompilerOptions } from "./utils.js";

/**
 * Compiler for parsing custom HTML 🤖
 */
export default class RiNCompiler {
    /**  */
    AppView: string
    Cache: { [x: string]: PageInfo };
    CacheMaxAge: number;
    private Tags: { settings: RegExp; components: RegExp; files: RegExp; imports: RegExp; scriptComponents: RegExp; scriptFiles: RegExp; };

    /**
     * Creates a new compiler 🤖
     * @param {string} appView Path to the main view of the app. All other pages are compiled inside this view.
     * @param {RiNCompilerOptions} [options] Options for the compiler
     */
    constructor(appView: string, options?: RiNCompilerOptions) {
        this.AppView = appView
        this.Tags = {
            settings: /(?:<!--|\/\*) <(Page\.[\w\.]*)>(.*)<\/Page.[\w\.]*> (?:-->|\*\/)/g,
            components: /(?:<!--|\/\*) <(App\.[\w\.]*)\/> (?:-->|\*\/)/g,
            files: /(?:<!--|\/\*) <File:([\w\.\/]*)\/> (?:-->|\*\/)/g,
            imports: /(?:<!--|\/\*) @Import (JS|CSS) \((.*)\) (?:-->|\*\/)/g,
            scriptComponents: /\/\* <(App\.[\w\.]*)\/> \*\//g,
            scriptFiles: /\/\* <File:([\w\.\/]*)\/> \*\//g
        }
        this.Cache = {}
        this.CacheMaxAge = options?.CacheMaxAge || 60000
        
        // Cache the main view
        ;(async () => {
            try {
                this.Cache.App = {
                    title: options?.title,
                    html: (await readFile(this.AppView)).toString(),
                    cachedAt: Date.now()
                }
            } catch (error) {
                console.error("🤖 Error: ", error)
            }
        })()
    }

    /**
     * Compiles the app 🔄
     * @param {string} page HTML cotent to be rendered
     * @returns {Promise<PageInfo>}
     */
    compile(page: string): Promise<PageInfo> {
        return new Promise(async res => {
            if (this.Cache?.[page] && (Date.now() - this.Cache[page].cachedAt) < this.CacheMaxAge) return res(this.Cache[page])

            var { html: Page, title: Title, imports: Imports } = this.renderPage(page)
            var App = { html: this.Cache.App?.html || ((this.Cache.App = { title: "", html: (await readFile(this.AppView)).toString() }) && this.Cache.App?.html), Page, Title, Imports }

            /* Tags 🤖 */ {
                var iterator, i

                // Components 🤖
                iterator = App.html.matchAll(this.Tags.components)
                do {
                    i = iterator.next()
                    !i.done && (App.html = App.html.replace(i.value[0], eval(i.value[1])))
                } while (!i.done)

                // Script Components 🤖
                // iterator = App.html.matchAll(this.Tags.scriptComponents)
                // do {
                //     i = iterator.next()
                //     !i.done && (App.html = App.html.replace(i.value[0], eval(i.value[1])))
                // } while (!i.done)

                // Files 🤖
                iterator = App.html.matchAll(this.Tags.files)
                do {
                    i = iterator.next()
                    !i.done && (App.html = App.html.replace(i.value[0], (await readFile(i.value[1])).toString()))
                } while (!i.done)

                // Script Files 🤖
                // iterator = App.html.matchAll(this.Tags.scriptFiles)
                // do {
                //     i = iterator.next()
                //     !i.done && (App.html = App.html.replace(i.value[0], (await readFile(i.value[1])).toString()))
                // } while (!i.done)
            }
            App.html = minifyHtml(App.html)
            this.Cache[page] = { cachedAt: Date.now(), html: App.html, title: App.Title, fresh: false, imports: App.Imports }
            setTimeout(() => (this.Cache[page] = undefined), this.CacheMaxAge)
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
            title: "Untitled",
            imports: { js: [], css: [], jsTags: "", cssTags: "" },
            html: page
        }

        /* Tags 🤖 */ {
            var iterator: IterableIterator<RegExpMatchArray>, i: IteratorResult<RegExpMatchArray, any>

            // Settings 🤖
            iterator = page.matchAll(this.Tags.settings)
            do {
                i = iterator.next()
                !i.done && eval(`${i.value[1]} = i.value[2]`)
            } while (!i.done)

            // Imports 📲
            iterator = page.matchAll(this.Tags.imports)
            do {
                i = iterator.next()
                !i.done && Page.imports[i.value[1]].push(i.value[2])
            } while (!i.done)
        }

        Page.imports.cssTags = Page.imports.css.map(url => `<link rel="stylesheet" href="${url}" class="imports">`).join("")
        Page.imports.jsTags = Page.imports.js.map(url => `<script src="${url}" class="imports"></script>`).join("")

        Page.html = minifyHtml(page)
        return Page
    }
}