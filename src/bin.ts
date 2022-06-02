#!/usr/bin/env node

import * as path from "path"
import { readdir, readFile, writeFile } from "fs/promises"
import RiNCompiler from "./compiler.js"
import { asType, debounce, getAllFiles, removeUndefined, singleTypeOnly, TokenList, Types } from "./utils.js"
import { RiNCompilerOptions } from "./common.js"
import { watch } from "fs"
import { relative, resolve } from "path"

const ERROR = {
    notAssignable(value: string, type: keyof Types) {
        console.error(`\x1b[1mBad Option:\x1b[0m ${value} is not assignable to the type of ${type}`)
    },
    unknownOption(option: string) {
        console.error(`\x1b[1mBad Option:\x1b[0m ${option} is an unknown to be passed`)
    }
}, MSG = {
    start: () => "\x1b[1m\x1b[35mStarting RiN 🌺✨\x1b[0m",
    ready: (t: number) => `Compiler is ready in \x1b[92m${t} ms\x1b[0m`,
    compilingFile: (f: string) => `🔄 Compiling file \x1b[90m=> \x1b[96m${f}\x1b[0m`,
    compiledFile: (f: string, t: number) => `✅ Done compiling \x1b[90m=> \x1b[96m${f}\x1b[0m \x1b[90m=> \x1b[92m${t} ms\x1b[0m`,
    doneCompiling: (t: number) => `Done compiling in \x1b[92m${t} ms\x1b[0m`,
    watching: () => "👀 Watching for file changes..."
}

interface Option<T extends keyof Types> {
    type: T
    description: string
    alias?: Lowercase<string>
    value: Types[T]
}

const options = asType<TokenList<
    Option<keyof Types>,
    Lowercase<string>
>>()({
    "out-dir": {
        type: "string",
        description: "Directory to output files",
        alias: "o",
        value: undefined
    },
    "src-dir": {
        type: "string",
        description: "Directory containing source files",
        alias: "s",
        value: process.env.PWD
    },
    "files": {
        type: "string",
        description: "Files to compile",
        alias: "f",
        value: undefined
    },
    "app-view": {
        type: "string",
        description: "App view of the app",
        alias: "av",
        value: undefined
    },
    "title": {
        type: "string",
        description: "Title of the app",
        value: undefined
    },
    "minify": {
        type: "boolean",
        description: "Minify the output",
        value: undefined
    },
    "watch": {
        type: "boolean",
        description: "Watch for file changes",
        value: undefined
    }
})

/**
 * Assigns a value to a option
 * @param optionName
 * @param value
 */
function addOption(optionName: keyof typeof options, value: string | undefined) {
    const option = options[optionName]

    switch (option.type) {
        case "boolean":
            option.value = parseBooleanOption(value)
            break

        default:
            option.value = value
    }
}

function addFlag(s: string) {
    let [flag, value] = s.split("=")

    if (!options[flag]) throw ERROR.unknownOption(flag)

    addOption(flag as keyof typeof options, value)
}

function addAliasToFlags(s: string) {
    let [alias, value] = s.split("="),
        flagWithTheAlias = Object.keys(options).find(k => options[k].alias === alias)

    if (!options[flagWithTheAlias]) return

    addOption(flagWithTheAlias as keyof typeof options, value)
}

function parseBooleanOption(value: string | undefined): boolean {
    if (value == "0" || value == "false") return false
    if (value == "1" || value == "true" || value == undefined) return true

    throw ERROR.notAssignable(value, "boolean")
}

function stringOnly(v: any): string | undefined {
    return singleTypeOnly(v, "string")
}

// Load the arguments 💭
process.argv.slice(2).forEach(v => {
    if (v.startsWith("--")) {
        return addFlag(v.substring(2))
    } else if (v.startsWith("-")) {
        return addAliasToFlags(v.substring(1))
    }
})

// Flags 🚩
let srcDir = options["src-dir"].value || process.env.PWD,
    outDir = options["out-dir"].value || process.env.PWD,
    files = stringOnly(options.files.value) || "all" as string | string[]

// Fixing the relative paths
!path.isAbsolute(srcDir) && (srcDir = path.resolve(process.env.PWD, srcDir))
!path.isAbsolute(outDir) && (outDir = path.resolve(process.env.PWD, outDir))

console.clear()
console.log(MSG.start(), "\n")

compile()

async function compile() {
    let times: number[] = []

    // Parse files
    "string" == typeof files && files.includes(",") && (files = files.split(","))
    // Get rid of type "all" as the files parameter
    if ("all" == files) {
        files = (await readdir(srcDir)).filter(f => /\.html$/.test(f) && "App.html" != f)
    } if (typeof files == "string") files = [files]

    let compilerOptions = removeUndefined(<RiNCompilerOptions>{
        title: options.title.value,
        minify: options.minify.value
    })

    const compiler = new RiNCompiler(srcDir, options["app-view"].value || "default", compilerOptions)

    async function compileFiles(filesToCompile?: string[]) {
        let compilerStartTime = performance.now()
        filesToCompile = filesToCompile || files as string[]
        console.log()

        await Promise.all(filesToCompile.map(async f => {
            let startTime = performance.now()

            log(MSG.compilingFile(f))

            let file = await readFile(path.resolve(srcDir, f))
            await writeFile(path.resolve(outDir, f), (await compiler.compile(file.toString())).html)

            log(MSG.compiledFile(f, performance.now() - startTime))
        }))

        console.log()
        log(MSG.doneCompiling(performance.now() - compilerStartTime))

        if (options.watch.value) {
            console.log()
            log(MSG.watching())
        }
    }

    compiler.on("ready", async () => {
        log(MSG.ready(performance.now()))

        await compileFiles()

        if (options.watch.value) {
            let compileFilesDebounce = debounce(compileFiles, 250);

            (await getAllFiles(srcDir)).forEach(filename => {
                watch(resolve(srcDir, filename), () => {
                    compileFilesDebounce( files.includes(relative(srcDir, filename)) ? [ relative(srcDir, filename) ] : undefined )
                })
            })
        }
    })

    function log(msg: string, ...args: string[]) {
        times.push(performance.now())
        console.log(`[\x1b[90m${new Date().toLocaleTimeString()}\x1b[0m] ${msg}`)
        args.forEach(m => console.log(m))
    }
}