import * as path from "path"
import { readdir, readFile, writeFile } from "fs/promises"
import RiNCompiler from "./compiler.js"
import { RiNOptions, PageInfo } from "./common.js"
import { numFormat } from "./utils.js"

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
    var times = []
    const log = (msg: string) => times.push(performance.now()) && console.log(`[\x1b[90m${numFormat(times.at(-1), 5, 10)}\x1b[0m] ${msg}`)
    log("\x1b[1m\x1b[35mStarting RiN 🌺✨\x1b[0m")

    const compiler: RiNCompiler = new RiNCompiler(srcDir, appView, options)

    compiler.on("ready", async () => {
        log(`Compiler is ready in \x1b[92m${performance.now() - times.at(-1)} ms\x1b[0m`)

        // Get rid of type "all" as the files parameter 🚫
        "all"==files&&(files=(await readdir(srcDir)).filter(f=>/\.html$/.test(f)&&"App.html"!=f))

        log(`Starting compiling the files after \x1b[92m${performance.now() - times.at(-1)} ms\x1b[0m`)

        // Compile the files
        await Promise.all(files.map(async (f) => {
            let startTime = performance.now()
            log(`🔄 Compiling file \x1b[90m=> \x1b[96m${f}\x1b[0m`)
            let file = await readFile(path.resolve(srcDir, f))
            await writeFile(path.resolve(options?.outDir || srcDir, f), (await compiler.compile(file.toString())).html)
            log(`✅ Done compiling \x1b[90m=> \x1b[96m${f}\x1b[0m \x1b[90m=> \x1b[92m${performance.now() - startTime} ms\x1b[0m`)
        }))

        log(`Done compiling in \x1b[92m${performance.now() - times[0]} ms\x1b[0m`)
    })
}

export const Compiler = RiNCompiler
export type CompiledPageInfo = PageInfo