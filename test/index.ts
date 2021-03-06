import { CompiledPageInfo, Compiler } from "../lib/index.js";
import { DEFAULTS } from "../lib/common.js";
import { __dirname } from "./utils.js";
import tags from "./tags.js";
import components from "./components.js";
import appWidgets from "./appWidgets.js";
import functionalWidgets from "./functionalWidgets.js";

export const { REGEXPS_FOR_TAGS: TAGS } = DEFAULTS

// Information about tests ๐งช
export const testsInfo = {
    tags: {
        singleLineSelection: {
            input: `<!-- <App.PageID/> -->`,
            output: {
                0: "<!-- <App.PageID/> -->",
                1: "PageID"
            }
        },
        multiLineSelection: {
            input: `<!-- <Page.PageID>
                        home
                    </Page.PageID> -->`,
            output: {
                0: `<!-- <Page.PageID>
                        home
                    </Page.PageID> -->`,
                1: "PageID",
                2: "home"
            }
        }
    },

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
            input: `<!-- <Component.Run>new Array(10).fill("๐บ").join("")</Component.Run> -->`,
            output: "๐บ๐บ๐บ๐บ๐บ๐บ๐บ๐บ๐บ๐บ"
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
                appView: `<!-- <App.Run>new Array(10).fill("๐บ").join("")</App.Run> -->\n <!-- <App.Capitalize>riN compiler</App.Capitalize> -->`,
                functionalWidgets: {
                    Capitalize: (value: string) => value.split(" ").map(v => v[0].toUpperCase() + v.slice(1, v.length)).join(" ")
                }
            },
            output: "๐บ๐บ๐บ๐บ๐บ๐บ๐บ๐บ๐บ๐บ RiN Compiler"
        }
    }
}

// Compiler ๐ค
export const compiler = new Compiler(__dirname, "default")

console.clear()

// Do the tests ๐งช
compiler.once("ready", async () => {
    console.log("\x1b[1m\x1b[35m%s\x1b[0m", "Starting Tests ๐บโจ")

    await tags()
    await components()
    await appWidgets()
    await functionalWidgets()

    console.log("\n")
})
