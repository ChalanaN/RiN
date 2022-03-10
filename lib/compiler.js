var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RiNCompiler_TAGS;
import { EventEmitter } from "events";
import * as fs from "fs";
import { access, readdir, readFile } from "fs/promises";
import { resolve } from "path";
import { DEFAULTS, ERRORS } from "./common.js";
import { minifyHtml, parseAttributes } from "./utils.js";
/**
 * Compiler for parsing custom HTML 🤖
 *
 * @author ChalanaN <wchalanaw@gmail.com>
 */
export default class RiNCompiler extends EventEmitter {
    /**
     * Creates a new compiler 🤖
     * @param {string} appView Path to the main view of the app. All other pages are compiled inside this view.
     * @param {RiNCompilerOptions} [options] Options for the compiler
     */
    constructor(srcDir, appView, options) {
        super();
        /** Regular Expressions used for searching tags. DO NOT EDIT THIS UNTIL YOU KNOW WHAT YOU ARE DOING */
        _RiNCompiler_TAGS.set(this, void 0);
        __classPrivateFieldSet(this, _RiNCompiler_TAGS, DEFAULTS.REGEXPS_FOR_TAGS, "f");
        this.srcDir = srcDir;
        this.options = { ...DEFAULTS.COMPILER_OPTIONS, ...options };
        this.Cache = {};
        this.Components = {};
        (async () => {
            // Find the app view
            appView = await (async () => {
                if (appView && "default" != appView && await access(resolve(srcDir, appView), fs.constants.R_OK).catch(() => false))
                    return resolve(srcDir, appView);
                if (!await access(resolve(srcDir, "views/App.html"), fs.constants.R_OK).catch(() => true))
                    return resolve(srcDir, "views/App.html");
                if (!await access(resolve(srcDir, "App.html"), fs.constants.R_OK).catch(() => true))
                    return resolve(srcDir, "App.html");
                throw new Error(ERRORS.MAIN_VIEW_NOT_FOUND);
            })();
            await Promise.all([
                // Cache the app view
                (async () => {
                    try {
                        this.Cache.App = { title: options?.title, html: (await readFile(appView)).toString(), cachedAt: Date.now() };
                    }
                    catch {
                        return this.emit("error", new Error(ERRORS.MAIN_VIEW_NOT_FOUND));
                    }
                })(),
                // Load components
                (async () => { try {
                    (await readdir(resolve(srcDir, "components"))).filter(v => v.endsWith(".html")).map(v => v.slice(0, v.length - 5)).forEach(async (v) => (this.Components[v] = { html: (await readFile(resolve(srcDir, "components", v + ".html"))).toString() }));
                }
                catch { } })()
            ]);
            this.emit("ready");
        })();
    }
    /**
     * Compiles the app 🔄
     * @param {string} page HTML content to be rendered
     * @returns {Promise<PageInfo>}
     */
    compile(page) {
        // ⭕ TODO ⭕ Instead of throwing an error, consider waiting for the compiler to load
        if (!this.Cache.App)
            throw new Error(ERRORS.COMPILER_NOT_READY);
        return new Promise(async (res) => {
            // Check cache
            if (this.Cache?.[page] && (Date.now() - this.Cache[page].cachedAt) < this.options.CacheMaxAge)
                return res(this.Cache[page]);
            var { html: Page, title: Title, imports: Imports, ...additionalProperties } = this.renderPage(page);
            var App = { html: this.Cache.App.html, Page, Title, Imports, ...additionalProperties, ...this.options.appWidgets, ...this.options.functionalWidgets };
            /* Widgets 🤖 */ {
                var iterator, i;
                // App Widgets 🤖
                iterator = App.html.matchAll(__classPrivateFieldGet(this, _RiNCompiler_TAGS, "f").appWidgets);
                do {
                    i = iterator.next();
                    !i.done && (App.html = App.html.replace(i.value[0], App[i.value.groups.property] || ""));
                } while (!i.done);
                // Functional Widgets 🤖
                iterator = App.html.matchAll(__classPrivateFieldGet(this, _RiNCompiler_TAGS, "f").functionalWidgets);
                do {
                    i = iterator.next();
                    !i.done && (App.html = App.html.replace(i.value[0], App[i.value.groups.property]?.(i.value.groups.value, App) || ""));
                } while (!i.done);
                // Files Widget 🤖
                iterator = App.html.matchAll(__classPrivateFieldGet(this, _RiNCompiler_TAGS, "f").files);
                try {
                    do {
                        i = iterator.next();
                        !i.done && (App.html = App.html.replace(i.value[0], (await readFile(resolve(this.srcDir, i.value.groups.filepath))).toString()));
                    } while (!i.done);
                }
                catch (err) {
                    throw new Error(ERRORS.Widgets.File.FILE_NOT_FOUND.concat("\n", err));
                }
                // Components 🤖
                iterator = App.html.matchAll(__classPrivateFieldGet(this, _RiNCompiler_TAGS, "f").components);
                do {
                    i = iterator.next();
                    !i.done && (App.html = App.html.replace(i.value[0], this.Components[i.value.groups.name] ? this.renderComponent(this.Components[i.value.groups.name].html, parseAttributes(i.value.groups.attributes)).html : ""));
                } while (!i.done);
            }
            // Minify the file if specified
            this.options.minify && (App.html = minifyHtml(App.html));
            // Cache the compiled page
            this.Cache[page] = { cachedAt: Date.now(), fresh: false, html: App.html, title: App.Title, imports: App.Imports };
            res({ html: App.html, title: App.Title, imports: App.Imports, fresh: true });
        });
    }
    /**
     * Compiles a page
     * @param {string} html Content of the page
     * @returns {PageInfo}
     */
    renderPage(html) {
        var Page = {
            title: this.options.title,
            imports: { js: [], css: [], jsTags: "", cssTags: "" },
            html
        };
        /* Setting Widgets 🤖 */ {
            var iterator, i;
            // Settings 🤖
            iterator = html.matchAll(__classPrivateFieldGet(this, _RiNCompiler_TAGS, "f").settings);
            do {
                i = iterator.next();
                !i.done && (Page[i.value.groups.property] = i.value.groups.value) && (Page.html = Page.html.replace(i.value[0], ""));
            } while (!i.done);
            // Imports 📲
            iterator = html.matchAll(__classPrivateFieldGet(this, _RiNCompiler_TAGS, "f").imports);
            do {
                i = iterator.next();
                !i.done && Page.imports[i.value[1]].push(i.value[2]) && (Page.html = Page.html.replace(i.value[0], ""));
            } while (!i.done);
        }
        Page.imports.cssTags = Page.imports.css.map(url => `<link rel="stylesheet" href="${url}" class="imports">`).join("");
        Page.imports.jsTags = Page.imports.js.map(url => `<script src="${url}" class="imports"></script>`).join("");
        return Page;
    }
    /**
     * Renders a component
     * @param {string} html HTML content of the component
     * @param {{ [x: string]: string | ((value: string, component: Component) => string) }} widgets Parameters passed to the component
     * @returns {Component} Rendered component
     */
    renderComponent(html, widgets) {
        var component = {
            html,
            Run: (v, Component) => eval(v),
            ...widgets
        };
        /* Widgets 🤖 */ {
            var iterator, i;
            // Component Widgets 🤖
            iterator = component.html.matchAll(__classPrivateFieldGet(this, _RiNCompiler_TAGS, "f").componentWidgets);
            do {
                i = iterator.next();
                !i.done && (component.html = component.html.replace(i.value[0], component[i.value[1]] || ""));
            } while (!i.done);
            // Component Functional Widgets 🤖
            iterator = component.html.matchAll(__classPrivateFieldGet(this, _RiNCompiler_TAGS, "f").componentFunctionalWidgets);
            do {
                i = iterator.next();
                !i.done && (component.html = component.html.replace(i.value[0], component[i.value.groups.property]?.(i.value.groups.value, component) || ""));
            } while (!i.done);
        }
        return component;
    }
}
_RiNCompiler_TAGS = new WeakMap();
//# sourceMappingURL=compiler.js.map