import { render } from "../preset/vue.js";
export const bridgeData = {
    "workspaceFolder": "file:///c%3A/Users/Soren/Desktop/Sites/Calendar_App_Chocov3/REFACTORED_CODEBASE",
    "serverRootDir": "/src/components",
    "previewFolderRelPath": "/src/components/preview",
    "activeFileRelPath": "src/components/calendar/RecurringEventSection.vue",
    "mapFileRelPath": "src/components/calendar/RecurringEventSection.vue",
    "presetName": "vue",
    "workspaceFolderName": "REFACTORED_CODEBASE"
};
export const preview = () => render(getMod);
const getMod = () => import("../../../../Users/Soren/AppData/Local/Programs/cursor/src/components/calendar/RecurringEventSection.vue");