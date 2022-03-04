/// <reference types="node" />
import { EventEmitter } from "events";
import { PageInfo, RiNCompilerOptions } from "./utils.js";
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
    readonly Cache: {
        [x: string]: PageInfo;
    };
    /** Regular Expressions used for searching tags. DO NOT EDIT THIS UNTIL YOU KNOW WHAT YOU ARE DOING */
    private TAGS;
    /**
     * Creates a new compiler 🤖
     * @param {string} appView Path to the main view of the app. All other pages are compiled inside this view.
     * @param {RiNCompilerOptions} [options] Options for the compiler
     */
    constructor(appView: string, options?: RiNCompilerOptions);
    /**
     * Compiles the app 🔄
     * @param {string} page HTML cotent to be rendered
     * @param {string} rootDir Root directory of the content. This is used for the `<File/>` widget.
     * @returns {Promise<PageInfo>}
     */
    compile(page: string, rootDir?: string): Promise<PageInfo>;
    /**
     * Compiles a page
     * @param {string} page Content of the page
     * @returns {PageInfo}
     */
    renderPage(page: string): PageInfo;
}
