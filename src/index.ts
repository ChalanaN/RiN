import * as fs from "fs"
import * as path from "path"
import { access, readdir, readFile, writeFile } from "fs/promises"
import RiNCompiler from "./compiler.js"
import { ERRORS, RiNOptions } from "./common.js"

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
export default async function RiN(srcDir: string, files: string[] | "all" = "all", appView?: string | "default", options?: RiNOptions) {
    // Checking for appView 👀
    appView = await (async () => {
        if (appView && "default" != appView && await access(path.resolve(srcDir, appView), fs.constants.R_OK).catch(() => false)) return path.resolve(srcDir, appView)
        if (!await access(path.resolve(srcDir, "views/App.html"), fs.constants.R_OK).catch(() => true)) return path.resolve(srcDir, "views/App.html")
        if (!await access(path.resolve(srcDir, "App.html"), fs.constants.R_OK).catch(() => true)) return path.resolve(srcDir, "App.html")
        throw new Error(ERRORS.MAIN_VIEW_NOT_FOUND)
    })()

    const compiler: RiNCompiler = new RiNCompiler(srcDir, "default", options)

    compiler.on("ready", async () =>{
        // Get rid of type "all" as the files parameter 🚫
        "all"==files&&(files=(await readdir(srcDir)).filter(f=>/\.html$/.test(f)&&"App.html"!=f))

        // Compile the files
        files.map(async f => {
            let file = await readFile(path.resolve(srcDir, f))
            await writeFile(path.resolve(options?.outDir || srcDir, f), (await compiler.compile(file.toString())).html)
        })
    })
    
}

export const Compiler = RiNCompiler