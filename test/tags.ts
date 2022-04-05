import { DEFAULTS } from "../lib/common.js";
import { testsInfo } from "./index.js";
import { headingLog, matchObjects, testLog } from "./utils.js";

export const selectingSingleLineTags = async () => {
    let { input, output } = testsInfo.tags.singleLineSelection,
        score = matchObjects(output, DEFAULTS.REGEXPS_FOR_TAGS.appWidgets.exec(input))

    testLog(score == 1, "Selecting Single-line Tags", score*100)
}

export const selectingMultiLineTags = async () => {
    let { input, output } = testsInfo.tags.multiLineSelection,
        score = matchObjects(output, DEFAULTS.REGEXPS_FOR_TAGS.settings.exec(input))

    testLog(score == 1, "Selecting Multi-line Tags", score*100)
}

export default async () => {
    headingLog("Tags")
    await selectingSingleLineTags()
    await selectingMultiLineTags()
}