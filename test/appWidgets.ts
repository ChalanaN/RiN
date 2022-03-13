import { compiler, testsInfo } from "./index.js";
import { headingLog, matchObjects, testLog } from "./utils.js";

export const definingWidgets = () => {
    let { input, output } = testsInfo.appWidgets.defining,
        page = compiler.renderPage(input)

    testLog(matchObjects(output, page) === 1, "Defining Widgets", matchObjects(output, page)*100)
}

export const accessingWidgets = async () => {
    let { input, output } = testsInfo.appWidgets.accessing

    compiler.Cache.App.html = input.appView
    let page = await compiler.compile(input.page)

    testLog(page.html === output, "Accessing Widgets")
}

export default async () => {
    headingLog("App Widgets")
    definingWidgets()
    await accessingWidgets()
}