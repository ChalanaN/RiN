import { EventEmitter } from "events";
import * as fs from "fs";
import { access, readdir, readFile } from "fs/promises";
import { resolve } from "path";
import { Component, DEFAULTS, ERRORS, PageInfo, RiNCompilerOptions } from "./common.js";
import { minifyHtml, parseAttributes } from "./utils.js";

/**
 * Compiler for parsing custom HTML 🤖
 * 
 * @author ChalanaN <wchalanaw@gmail.com>
 */
export default class RiNCompiler extends EventEmitter {
    /** Source directory of the app. All other relative paths passed to the compiler will be relative to this */
    readonly srcDir: string;
    options: RiNCompilerOptions;

    /** Pages cached by the compiler */
    readonly Cache: { [x: string]: PageInfo };
    /** Components cached by the compiler */
    readonly Components: { [x: string]: Component };

    /** Regular Expressions used for searching tags. DO NOT EDIT THIS UNTIL YOU KNOW WHAT YOU ARE DOING */
    #TAGS: typeof DEFAULTS.REGEXPS_FOR_TAGS;

    /** Is the compiler ready to compile? 
     * @readonly */
    ready: boolean;

    /**
     * Creates a new compiler 🤖
     * @param {string} appView Path to the main view of the app. All other pages are compiled inside this view.
     * @param {RiNCompilerOptions} [options] Options for the compiler
     */
    constructor(srcDir: string, appView?: "default" | string, options?: RiNCompilerOptions) {
        super();

        this.#TAGS = DEFAULTS.REGEXPS_FOR_TAGS

        this.srcDir = srcDir
        this.options = { ...DEFAULTS.COMPILER_OPTIONS, ...options }
        this.Cache = {}
        this.Components = {}
        this.ready = false

        ;(async () => {
            // Find the app view
            appView = await (async () => {
                if (appView && "default" != appView && await access(resolve(srcDir, appView), fs.constants.R_OK).catch(() => false)) return resolve(srcDir, appView)
                if (!await access(resolve(srcDir, "views/App.html"), fs.constants.R_OK).catch(() => true)) return resolve(srcDir, "views/App.html")
                if (!await access(resolve(srcDir, "App.html"), fs.constants.R_OK).catch(() => true)) return resolve(srcDir, "App.html")
                throw new Error(ERRORS.MAIN_VIEW_NOT_FOUND)
            })()

            await Promise.all([
                // Cache the app view
                (async () => {
                    try {
                        this.Cache.App = { title: options?.title, html: (await readFile(appView)).toString(), cachedAt: Date.now() }
                    } catch { return this.emit("error", new Error(ERRORS.MAIN_VIEW_NOT_FOUND)) }
                })(),

                // Load components
                (async () => { try { (await readdir(resolve(srcDir, "components"))).filter(v=>v.endsWith(".html")).map(v=>v.slice(0, v.length-5)).forEach(async v => (this.Components[v] = { html: (await readFile(resolve(srcDir, "components", v+".html"))).toString() })) } catch {} })()
            ])

            this.ready = true
            this.emit("ready")
        })()
    }

    /**
     * Compiles the app 🔄
     * @param {string} page HTML content to be rendered
     * @returns {Promise<PageInfo>}
     */
    compile(page: string): Promise<PageInfo> {
        // ⭕ TODO ⭕ Instead of throwing an error, consider waiting for the compiler to load
        if (!this.Cache.App) throw new Error(ERRORS.COMPILER_NOT_READY)

        return new Promise(async (res) => {
            // Check cache
            if (this.Cache?.[page] && (Date.now() - this.Cache[page].cachedAt) < this.options.CacheMaxAge) return res(this.Cache[page])

            var { html: Page, title: Title, imports: Imports, ...widgets } = this.renderPage(page)
            var App = { html: this.Cache.App.html, Page, Title, Imports, ...widgets, ...this.options.appWidgets, ...this.options.functionalWidgets }

            let appWidget = (i: IteratorResult<RegExpMatchArray, any>) => {
                try {
                    App.html = App.html.replace(i.value[0], (i.value.groups.property.split(".").length > 2 ? eval(`App.${i.value.groups.property.replace(/^App\./, "")}`) : App[i.value.groups.property.replace(/^App\./, "")]) || "")
                } catch {
                    App.html = App.html.replace(i.value[0], App[i.value.groups.property] || "")
                }
            }, functionalWidget = (i: IteratorResult<RegExpMatchArray, any>) => {
                try {
                    App.html = App.html.replace(i.value[0], (i.value.groups.property.split(".").length > 2 ? eval(`App.${i.value.groups.property.replace(/^App\./, "")}`) : App[i.value.groups.property.replace(/^App\./, "")])?.(i.value.groups.value, App) || "")
                } catch {
                    App.html = App.html.replace(i.value[0], "")
                }
            }, filesWidget = async (i: IteratorResult<RegExpMatchArray, any>) => {
                try {
                    App.html = App.html.replace(i.value[0], (await readFile(resolve(this.srcDir, i.value.groups.attributes.trim().replace(/^:/, "")))).toString())
                } catch (err) {
                    throw new Error(ERRORS.Widgets.File.FILE_NOT_FOUND.concat("\n\n", err))
                }
            }, component = async (i: IteratorResult<RegExpMatchArray, any>) => {
                try {
                    App.html = App.html.replace(i.value[0], this.Components[i.value.groups.property] ? this.renderComponent(this.Components[i.value.groups.property].html, parseAttributes(i.value.groups.attributes)).html : "")
                } catch (err) {
                    App.html = App.html.replace(i.value[0], "")
                }
            }

            {
                var iterator: IterableIterator<RegExpMatchArray>, i: IteratorResult<RegExpMatchArray, any>

                iterator = App.html.matchAll(this.#TAGS.selfClosing)

                while (!(i = iterator.next()).done) {
                        switch (i.value.groups.property.split(".")[0]) {
                            case "App": appWidget(i); break;
                            case "File": await filesWidget(i); break;
                            default: component(i); break;
                        }
                }

                iterator = App.html.matchAll(this.#TAGS.pairs)

                while (!(i = iterator.next()).done) {
                        switch (i.value.groups.property.split(".")[0]) {
                            case "App": functionalWidget(i); break;
                        }
                }
            }

            // Minify the file if specified
            this.options.minify && (App.html = minifyHtml(App.html))
            // Cache the compiled page
            this.Cache[page] = { cachedAt: Date.now(), fresh: false, html: App.html, title: App.Title, imports: App.Imports }

            res({ html: App.html, title: App.Title, imports: App.Imports, fresh: true })
        })
    }

    /**
     * Compiles a page
     * @param {string} html Content of the page
     * @returns {PageInfo}
     */
    renderPage(html: string): PageInfo {
        var Page: PageInfo = {
            title: this.options.title,
            imports: { js: [], css: [], jsTags: "", cssTags: "" },
            html
        }

        /* Declare Widgets 🤖 */ {
            var iterator: IterableIterator<RegExpMatchArray>, i: IteratorResult<RegExpMatchArray, any>

            // Widgets 🤖
            iterator = html.matchAll(this.#TAGS.pageSettings)
            while (!(i = iterator.next()).done) {
                (Page[i.value.groups.property] = i.value.groups.value) && (Page.html = Page.html.replace(i.value[0], ""))
            }

            // Imports 📲
            iterator = html.matchAll(this.#TAGS.imports)
            while (!(i = iterator.next()).done) {
                Page.imports[i.value[1].toLowerCase()].push(i.value[2]) && (Page.html = Page.html.replace(i.value[0], ""))
            }
        }

        Page.imports.cssTags = Page.imports.css.map(url => `<link rel="stylesheet" href="${url}" class="imports">`).join("")
        Page.imports.jsTags = Page.imports.js.map(url => `<script src="${url}" class="imports"></script>`).join("")

        return Page
    }

    /**
     * Renders a component
     * @param {string} html HTML content of the component
     * @param {{ [x: string]: string | ((value: string, component: Component) => string) }} widgets Parameters passed to the component
     * @returns {Component} Rendered component
     */
    renderComponent(html: string, widgets: { [x: string]: string | ((value: string, component: Component) => string) }): Component {
        var component: Component = {
            html,
            Run: (v: string, Component: Component) => eval(v),
            ...widgets
        }

        /* Widgets 🤖 */ {
            var iterator: IterableIterator<RegExpMatchArray>, i: IteratorResult<RegExpMatchArray, any>

            // Component Widgets 🤖
            iterator = component.html.matchAll(this.#TAGS.componentWidgets)
            while (!(i = iterator.next()).done) {
                try { (component.html = component.html.replace(i.value[0], i.value.groups.property.includes(".") ? eval(`component.${i.value.groups.property}`) : component[i.value.groups.property] || "")) } catch {}
            }

            // Component Functional Widgets 🤖
            iterator = component.html.matchAll(this.#TAGS.componentFunctionalWidgets)
            while (!(i = iterator.next()).done) {
                try { (component.html = component.html.replace(i.value[0], (i.value.groups.property.includes(".") ? eval(`component.${i.value.groups.property}`) : component[i.value.groups.property])?.(i.value.groups.value, component) || "")) } catch {}
            }
        }

        return component
    }
}