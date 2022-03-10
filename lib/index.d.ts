import RiNCompiler from "./compiler.js";
import { RiNOptions, PageInfo } from "./common.js";
/**
 * Compiles all the files or selected files in a folder 💾
 *
 * @example RiN(path.resolve(__dirname, "src"), "all", "default", { outFolder: path.resolve(__dirname, "dist") })
 *
 * @param {string} srcDir Path to the folder containing files to compile
 * @param {string[] | "all"} [files] File paths relative to the specified location (If not specified or specified as `all`, all the files in the folder will be compiled)
 * @param {string | "default"} [appView] Main view of the app. All other pages are compiled inside this view. (If not specified or specified as `default`, `/views/App.html` or `/App.html` will be taken as the main view). Throws an error if app view isn't found.
 * @param {RiNOptions} [options] Additional options for the compiler
 */
export default function RiN(srcDir: string, files?: string[] | "all", appView?: string | "default", options?: RiNOptions): Promise<void>;
export declare const Compiler: typeof RiNCompiler;
export declare type CompiledPageInfo = PageInfo;
