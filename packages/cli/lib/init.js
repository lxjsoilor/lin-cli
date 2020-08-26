"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = require("./create");
const presets = {
    "aaaaa": {
        "useConfigFiles": true,
        "plugins": {
            "@vue/cli-plugin-router": {
                "historyMode": true
            }
        }
    },
    "admin": {
        "useConfigFiles": true,
        "plugins": {
            "@vue/cli-plugin-babel": {
                version: "^4.2.3"
            },
            "@vue/cli-plugin-typescript": {
                "classComponent": true,
                "useTsWithBabel": true,
                version: "^4.2.3"
            },
            "@vue/cli-plugin-router": {
                "historyMode": true,
                version: "^4.2.3"
            },
            "@vue/cli-plugin-vuex": {
                version: "^4.2.3"
            },
            "@tiger/plugin-admin": {
                "historyMode": true,
                version: "^1.0.0-alpha.23"
            },
            "@tiger/plugin-table": {
                "historyMode": true,
                version: "^1.0.0-alpha.2"
            }
        }
    }
};
function default_1(name, options) {
    console.log(name, options);
    const { git, project } = options;
    if (git) {
        //  todo
    }
    else {
        if (project) {
            create_1.create(project, { preset: presets[name] });
        }
        else {
        }
    }
}
exports.default = default_1;
