import { CompiledPageInfo, Compiler } from "../lib/index.js";
import { DEFAULTS } from "../lib/common.js";
import { __dirname } from "./utils.js";
import components from "./components.js";
import appWidgets from "./appWidgets.js";
import functionalWidgets from "./functionalWidgets.js";

export const { REGEXPS_FOR_TAGS: TAGS } = DEFAULTS

// Information about tests 🧪
export const testsInfo = {
    components: {
        attributes: {
            input: `<!-- <CustomComponent title="Title" description="This is the description" someJson="{ 'about': 'this is some example json', 'testArray': [ 0, 1, 2 ] }"/> -->`,
            output: {
                title: "Title",
                description: "This is the description",
                someJson: `{ 'about': 'this is some example json', 'testArray': [ 0, 1, 2 ] }`
            }
        },
        functionalWidgets: {
            input: `<!-- <Component.Run>new Array(10).fill("🌺").join("")</Component.Run> -->`,
            output: "🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺"
        }
    },

    appWidgets: {
        defining: {
            input: `<!-- <Page.PageID>home</Page.PageID> -->\n<!-- <Page.Name>The Homepage</Page.Name> -->`,
            output: {
                PageID: "home",
                Name: "The Homepage"
            }
        },
        accessing: {
            input: {
                appView: `<!-- <App.PageID/> --> > <!-- <App.Name/> -->`,
                page: `<!-- <Page.PageID>home</Page.PageID> -->\n<!-- <Page.Name>The Homepage</Page.Name> -->`
            },
            output: "home > The Homepage"
        }
    },

    functionalWidgets: {
        using: {
            input: {
                appView: `<!-- <App.Run>new Array(10).fill("🌺").join("")</App.Run> -->\n <!-- <App.Capitalize>riN compiler</App.Capitalize> -->`,
                functionalWidgets: {
                    Capitalize: (value: string) => value.split(" ").map(v => v[0].toUpperCase() + v.slice(1, v.length)).join(" ")
                }
            },
            output: "🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺 RiN Compiler"
        }
    }
}

// Compiler 🤖
export const compiler = new Compiler(__dirname, "default")

console.clear()

// Do the tests 🧪
compiler.once("ready", async () => {
    console.log("\x1b[1m\x1b[96m%s\x1b[0m", "Starting Tests 🤖")

    await components()
    await appWidgets()
    await functionalWidgets()

    console.log("\n")
})
