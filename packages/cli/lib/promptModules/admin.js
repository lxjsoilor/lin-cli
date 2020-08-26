"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (cli) => {
    cli.injectFeature({
        name: 'Admin',
        value: 'admin',
        description: '选择中后台模板',
    });
    cli.onPromptComplete((answers, options) => {
        if (answers.features.includes('admin')) {
            options.plugins['@tiger/plugin-admin'] = {
                historyMode: answers.historyMode
            };
        }
    });
};
