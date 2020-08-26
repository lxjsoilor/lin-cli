"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (cli) => {
    cli.injectFeature({
        name: 'Admin',
        value: 'admin',
        description: '选择中后台模板',
    });
    // cli.injectPrompt({
    //   name: 'historyMode',
    //   when: (answers:any) => answers.features.includes('admin'),
    //   type: 'confirm',
    //   message: `Use history mode for router? (Requires proper server setup for index fallback in production)}`,
    //   description: `By using the HTML5 History API, the URLs don't need the '#' character anymore.`,
    //   link: 'https://router.vuejs.org/guide/essentials/history-mode.html'
    // })
    cli.onPromptComplete((answers, options) => {
        if (answers.features.includes('admin')) {
            options.plugins['@tiger/plugin-admin'] = {
                historyMode: answers.historyMode
            };
        }
    });
};
