import * as path from "path";
import { readdir, readFile, writeFile } from "fs/promises";
import RiNCompiler from "./compiler.js";
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
export default async function RiN(srcDir, files = "all", appView, options) {
    var times = [];
    const log = (msg) => times.push(performance.now()) && console.log(`[${times.at(-1)}] ${msg}`);
    log("Starting RiN 🤖");
    const compiler = new RiNCompiler(srcDir, appView, options);
    compiler.on("ready", async () => {
        log(`Compiler is ready in ${performance.now() - times.at(-1)}`);
        // Get rid of type "all" as the files parameter 🚫
        "all" == files && (files = (await readdir(srcDir)).filter(f => /\.html$/.test(f) && "App.html" != f));
        log(`Starting compiling the files after ${performance.now() - times.at(-1)}`);
        // Compile the files
        await Promise.all(files.map(async (f) => {
            log(`Compiling file : ${f}`);
            let file = await readFile(path.resolve(srcDir, f));
            await writeFile(path.resolve(options?.outDir || srcDir, f), (await compiler.compile(file.toString())).html);
            log(`Done compiling : ${f} : ${performance.now() - times.at(-1)}`);
        }));
        log(`Done compiling in ${performance.now() - times[0]} milliseconds`);
    });
}
export const Compiler = RiNCompiler;
//# sourceMappingURL=index.js.map