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

            /* Widgets 🤖 */ {
                var iterator: IterableIterator<RegExpMatchArray>, i: IteratorResult<RegExpMatchArray, any>

                // App Widgets and Custom Widgets 🤖
                iterator = App.html.matchAll(this.#TAGS.appWidgets)
                do {
                    i = iterator.next()
                    try { !i.done && (App.html = App.html.replace(i.value[0], (i.value.groups.property.includes(".") ? eval(`App.${i.value.groups.property}`) : App[i.value.groups.property]) || "")) } catch { App.html = App.html.replace(i.value[0], App[i.value.groups.property] || "") }
                } while (!i.done)

                // Functional Widgets 🤖
                iterator = App.html.matchAll(this.#TAGS.functionalWidgets)
                do {
                    i = iterator.next()
                    try { !i.done && (App.html = App.html.replace(i.value[0], (i.value.groups.property.includes(".") ? eval(`App.${i.value.groups.property}`) : App[i.value.groups.property])?.(i.value.groups.value, App) || "")) } catch {}
                } while (!i.done)

                // Files Widget 🤖
                iterator = App.html.matchAll(this.#TAGS.files)
                try {
                    do {
                        i = iterator.next()
                        !i.done && (App.html = App.html.replace(i.value[0], (await readFile(resolve(this.srcDir, i.value.groups.filepath))).toString()))
                    } while (!i.done)
                } catch (err) { throw new Error(ERRORS.Widgets.File.FILE_NOT_FOUND.concat("\n\n", err)) }

                // Components 🤖
                iterator = App.html.matchAll(this.#TAGS.components)
                do {
                    i = iterator.next()
                    !i.done && (App.html = App.html.replace(i.value[0], this.Components[i.value.groups.name] ? this.renderComponent(this.Components[i.value.groups.name].html, parseAttributes(i.value.groups.attributes)).html : ""))
                } while (!i.done)
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
            iterator = html.matchAll(this.#TAGS.settings)
            do {
                i = iterator.next()
                !i.done && (Page[i.value.groups.property] = i.value.groups.value) && (Page.html = Page.html.replace(i.value[0], ""))
            } while (!i.done)

            // Imports 📲
            iterator = html.matchAll(this.#TAGS.imports)
            do {
                i = iterator.next()
                !i.done && Page.imports[i.value[1].toLowerCase()].push(i.value[2]) && (Page.html = Page.html.replace(i.value[0], ""))
            } while (!i.done)
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
            do {
                i = iterator.next()
                try { !i.done && (component.html = component.html.replace(i.value[0], i.value.groups.property.includes(".") ? eval(`component.${i.value.groups.property}`) : component[i.value.groups.property] || "")) } catch {}
            } while (!i.done)

            // Component Functional Widgets 🤖
            iterator = component.html.matchAll(this.#TAGS.componentFunctionalWidgets)
            do {
                i = iterator.next()
                try { !i.done && (component.html = component.html.replace(i.value[0], (i.value.groups.property.includes(".") ? eval(`component.${i.value.groups.property}`) : component[i.value.groups.property])?.(i.value.groups.value, component) || "")) } catch {}
            } while (!i.done)
        }

        return component
    }
}