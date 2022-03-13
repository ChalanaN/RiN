import { compiler, testsInfo } from "./index.js";
import { headingLog, matchObjects, testLog } from "./utils.js";

export const usingFunctionalWidgets = async () => {
    let { input, output } = testsInfo.functionalWidgets.using

    compiler.Cache.App.html = input.appView
    compiler.options.functionalWidgets = { ...compiler.options.functionalWidgets, ...input.functionalWidgets }
    let page = await compiler.compile("")

    testLog(page.html === output, "Using Functional Widgets")
}

export default async () => {
    headingLog("Functional Widgets")
    await usingFunctionalWidgets()
}