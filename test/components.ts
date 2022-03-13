import { parseAttributes } from "../lib/utils.js";
import { compiler, TAGS, testsInfo } from "./index.js";
import { headingLog, matchObjects, testLog } from "./utils.js";

export const componentAttributes = () => {
    let { input, output } = testsInfo.components.attributes,
        { attributes } = TAGS.components.exec(input).groups,
        parsedAttributes = parseAttributes(attributes)

    testLog(matchObjects(output, parsedAttributes) === 1, "Attributes", matchObjects(output, parsedAttributes)*100)
}

export const componentFunctionalWidgets = () => {
    let { input, output } = testsInfo.components.functionalWidgets,
        component = compiler.renderComponent(input, {})

    testLog(component.html === output, "Component Functional Widgets")
}

export default async () => {
    headingLog("Components")
    componentAttributes()
    componentFunctionalWidgets()
}