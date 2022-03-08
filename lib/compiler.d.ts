/// <reference types="node" />
import { EventEmitter } from "events";
import { Component, PageInfo, RiNCompilerOptions } from "./common.js";
/**
 * Compiler for parsing custom HTML 🤖
 *
 * @author ChalanaN <wchalanaw@gmail.com>
 */
export default class RiNCompiler extends EventEmitter {
    #private;
    /** Source directory of the app. All other relative paths passed to the compiler will be relative to this */
    readonly srcDir: string;
    options: RiNCompilerOptions;
    /** Pages cached by the compiler */
    readonly Cache: {
        [x: string]: PageInfo;
    };
    /** Components cached by the compiler */
    readonly Components: {
        [x: string]: Component;
    };
    /**
     * Creates a new compiler 🤖
     * @param {string} appView Path to the main view of the app. All other pages are compiled inside this view.
     * @param {RiNCompilerOptions} [options] Options for the compiler
     */
    constructor(srcDir: string, appView?: "default" | string, options?: RiNCompilerOptions);
    /**
     * Compiles the app 🔄
     * @param {string} page HTML content to be rendered
     * @param {string} rootDir Root directory of the content. This is used for the `<File/>` widget.
     * @returns {Promise<PageInfo>}
     */
    compile(page: string): Promise<PageInfo>;
    /**
     * Compiles a page
     * @param {string} html Content of the page
     * @returns {PageInfo}
     */
    renderPage(html: string): PageInfo;
    /**
     * Renders a component
     * @param {string} html HTML content of the component
     * @param {{ [x: string]: string | ((value: string, component: Component) => string) }} widgets Parameters passed to the component
     * @returns {Component} Rendered component
     */
    renderComponent(html: string, widgets: {
        [x: string]: string | ((value: string, component: Component) => string);
    }): Component;
}
