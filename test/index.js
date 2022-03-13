import { Compiler } from "../lib/index.js";
import { DEFAULTS } from "../lib/common.js";
import { __dirname } from "./utils.js";
import components from "./components.js";
import appWidgets from "./appWidgets.js";
import functionalWidgets from "./functionalWidgets.js";
export const { REGEXPS_FOR_TAGS: TAGS } = DEFAULTS;
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
                    Capitalize: (value) => value.split(" ").map(v => v[0].toUpperCase() + v.slice(1, v.length)).join(" ")
                }
            },
            output: "🌺🌺🌺🌺🌺🌺🌺🌺🌺🌺 RiN Compiler"
        }
    }
};
// Compiler 🤖
export const compiler = new Compiler(__dirname, "default");
console.clear();
// Do the tests 🧪
compiler.once("ready", async () => {
    console.log("\x1b[1m\x1b[96m%s\x1b[0m", "Starting Tests 🤖");
    await components();
    await appWidgets();
    await functionalWidgets();
    console.log("\n");
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQW9CLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzdELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3ZDLE9BQU8sVUFBVSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sVUFBVSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8saUJBQWlCLE1BQU0sd0JBQXdCLENBQUM7QUFFdkQsTUFBTSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUE7QUFFbEQsNkJBQTZCO0FBQzdCLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRztJQUNyQixVQUFVLEVBQUU7UUFDUixVQUFVLEVBQUU7WUFDUixLQUFLLEVBQUUsK0pBQStKO1lBQ3RLLE1BQU0sRUFBRTtnQkFDSixLQUFLLEVBQUUsT0FBTztnQkFDZCxXQUFXLEVBQUUseUJBQXlCO2dCQUN0QyxRQUFRLEVBQUUsb0VBQW9FO2FBQ2pGO1NBQ0o7UUFDRCxpQkFBaUIsRUFBRTtZQUNmLEtBQUssRUFBRSwyRUFBMkU7WUFDbEYsTUFBTSxFQUFFLHNCQUFzQjtTQUNqQztLQUNKO0lBRUQsVUFBVSxFQUFFO1FBQ1IsUUFBUSxFQUFFO1lBQ04sS0FBSyxFQUFFLHdGQUF3RjtZQUMvRixNQUFNLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLE1BQU07Z0JBQ2QsSUFBSSxFQUFFLGNBQWM7YUFDdkI7U0FDSjtRQUNELFNBQVMsRUFBRTtZQUNQLEtBQUssRUFBRTtnQkFDSCxPQUFPLEVBQUUsK0NBQStDO2dCQUN4RCxJQUFJLEVBQUUsd0ZBQXdGO2FBQ2pHO1lBQ0QsTUFBTSxFQUFFLHFCQUFxQjtTQUNoQztLQUNKO0lBRUQsaUJBQWlCLEVBQUU7UUFDZixLQUFLLEVBQUU7WUFDSCxLQUFLLEVBQUU7Z0JBQ0gsT0FBTyxFQUFFLHdIQUF3SDtnQkFDakksaUJBQWlCLEVBQUU7b0JBQ2YsVUFBVSxFQUFFLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUNoSDthQUNKO1lBQ0QsTUFBTSxFQUFFLG1DQUFtQztTQUM5QztLQUNKO0NBQ0osQ0FBQTtBQUVELGNBQWM7QUFDZCxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBRTFELE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUVmLGtCQUFrQjtBQUNsQixRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtJQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLG1CQUFtQixDQUFDLENBQUE7SUFFNUQsTUFBTSxVQUFVLEVBQUUsQ0FBQTtJQUNsQixNQUFNLFVBQVUsRUFBRSxDQUFBO0lBQ2xCLE1BQU0saUJBQWlCLEVBQUUsQ0FBQTtJQUV6QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3JCLENBQUMsQ0FBQyxDQUFBIn0=