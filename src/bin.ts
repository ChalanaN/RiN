#!/usr/bin/env node

import * as path from "path"
import { readdir, readFile, writeFile } from "fs/promises"
import RiNCompiler from "./compiler.js"
import { asType, numFormat, removeUndefined, singleTypeOnly, TokenList, Types } from "./utils.js"
import { RiNCompilerOptions } from "./common.js"

const error = {
    notAssignable(value: string, type: keyof Types) {
        console.error(`\x1b[1mBad Option:\x1b[0m ${value} is not assignable to the type of ${type}`)
    },
    unknownOption(option: string) {
        console.error(`\x1b[1mBad Option:\x1b[0m ${option} is an unknown to be passed`)
    }
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

    if (!options[flag]) throw error.unknownOption(flag)

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

    throw error.notAssignable(value, "boolean")
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

console.log("\x1b[1m\x1b[35mStarting RiN 🌺✨\x1b[0m", "\n")

compile()

async function compile() {
    var times: number[] = []

    // Flags 🚩
    let srcDir = options["src-dir"].value || process.env.PWD,
        outDir = options["out-dir"].value || process.env.PWD,
        files = stringOnly(options.files.value) || "all" as string | string[]

    // Fixing the relative paths
    !path.isAbsolute(srcDir) && (srcDir = path.resolve(process.env.PWD, srcDir))
    !path.isAbsolute(outDir) && (outDir = path.resolve(process.env.PWD, outDir))

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

    const compiler = new RiNCompiler(srcDir, stringOnly(options["app-view"]) || "default", compilerOptions)

    compiler.on("ready", async () => {
        log(`Compiler is ready in \x1b[92m${performance.now() - times.at(-1)} ms\x1b[0m`)

        // Compile the files
        await Promise.all((files as string[]).map(async f => {
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