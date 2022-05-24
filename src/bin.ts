#!/usr/bin/env node

import * as path from "path"
import { readdir, readFile, writeFile } from "fs/promises"
import RiNCompiler from "./compiler.js"
import { RiNOptions, PageInfo } from "./common.js"
import { numFormat, removeUndefined, singleTypeOnly, TokenList, Types } from "./utils.js"

const flags: TokenList<string | true> = {},
    aliases: TokenList<string> = {
        "o": "out-dir",
        "s": "src-dir",
    }

let srcDir: string, outDir: string

function addFlag(s: string) {
    let [flag, value] = s.split("=")
    flags[flag] = value ?? true
}

function addAliasToFlags(s: string) {
    let [alias, value] = s.split("=")
    aliases[alias] && (flags[aliases[alias]] = value ?? true)
}

function parseBooleanFlag(s: string | true) {
    return s == "false" ? false : (s ? true : undefined)
}

function stringOnly(v: any): string | undefined {
    return singleTypeOnly(v, "string")
}

process.argv.slice(2).forEach(v => {
    if (v.startsWith("--")) {
        return addFlag(v.substring(2))
    } else if (v.startsWith("-")) {
        return addAliasToFlags(v.substring(1))
    }

    srcDir ? (outDir = v) : (srcDir = v)
})

compile()

function compile() {
    srcDir = srcDir || stringOnly(flags["src-dir"]) || process.env.PWD
    outDir = outDir || stringOnly(flags["out-dir"])

    // Fixing the relative paths
    !path.isAbsolute(srcDir) && (srcDir = path.resolve(process.env.PWD, srcDir))
    !path.isAbsolute(outDir) && (outDir = path.resolve(process.env.PWD, outDir))

    var times: number[] = []

    // Flags 🚩
    let { title, minify } = flags,
        files: string | string[] = stringOnly(flags.files) || "all",
        options = removeUndefined({
            title,
            minify: parseBooleanFlag(minify)
        })

    "string" == typeof files && files.includes(",") && (files = files.split(","))

    log("\x1b[1m\x1b[35mStarting RiN 🌺✨\x1b[0m")

    const compiler = new RiNCompiler(srcDir, stringOnly(flags["app-view"]) || "default", options)

    compiler.on("ready", async () => {
        log(`Compiler is ready in \x1b[92m${performance.now() - times.at(-1)} ms\x1b[0m`)

        // Get rid of type "all" as the files parameter 🚫
        "all" == files && (files = (await readdir(srcDir)).filter(f => /\.html$/.test(f) && "App.html" != f))
        typeof files == "string" && (files = [files])

        log(`Starting compiling the files after \x1b[92m${performance.now() - times.at(-1)} ms\x1b[0m`)

        // Compile the files
        await Promise.all(files.map(async f => {
            let startTime = performance.now()

            log(`🔄 Compiling file \x1b[90m=> \x1b[96m${f}\x1b[0m`)

            let file = await readFile(path.resolve(srcDir, f))
            await writeFile(path.resolve(outDir || srcDir, f), (await compiler.compile(file.toString())).html)
            log(`✅ Done compiling \x1b[90m=> \x1b[96m${f}\x1b[0m \x1b[90m=> \x1b[92m${performance.now() - startTime} ms\x1b[0m`)
        }))

        log(`Done compiling in \x1b[92m${performance.now() - times[0]} ms\x1b[0m`)
    })

    function log(msg: string) {
        times.push(performance.now()) && console.log(`[\x1b[90m${numFormat(times.at(-1), 5, 10)}\x1b[0m] ${msg}`)
    }
}