"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (cli) => {
    cli.injectFeature({
        name: "Table",
        value: "table",
        description: "选择中后台模板",
    });
    cli.onPromptComplete((answers, options) => {
        if (answers.features.includes("table")) {
            options.plugins["@tiger/plugin-table"] = {
                historyMode: answers.historyMode,
            };
        }
    });
};
