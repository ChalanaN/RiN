import { compiler, testsInfo } from "./index.js";
import { headingLog, testLog } from "./utils.js";
export const usingFunctionalWidgets = async () => {
    let { input, output } = testsInfo.functionalWidgets.using;
    compiler.Cache.App.html = input.appView;
    compiler.options.functionalWidgets = { ...compiler.options.functionalWidgets, ...input.functionalWidgets };
    let page = await compiler.compile("");
    testLog(page.html === output, "Using Functional Widgets");
};
export default async () => {
    headingLog("Functional Widgets");
    await usingFunctionalWidgets();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25hbFdpZGdldHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmdW5jdGlvbmFsV2lkZ2V0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNqRCxPQUFPLEVBQUUsVUFBVSxFQUFnQixPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFL0QsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUcsS0FBSyxJQUFJLEVBQUU7SUFDN0MsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFBO0lBRXpELFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFBO0lBQ3ZDLFFBQVEsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUMxRyxJQUFJLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7SUFFckMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFLDBCQUEwQixDQUFDLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBRUQsZUFBZSxLQUFLLElBQUksRUFBRTtJQUN0QixVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtJQUNoQyxNQUFNLHNCQUFzQixFQUFFLENBQUE7QUFDbEMsQ0FBQyxDQUFBIn0=