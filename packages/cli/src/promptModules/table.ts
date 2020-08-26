export default (cli: any) => {
	cli.injectFeature({
		name: "Table",
		value: "table",
		description: "选择中后台模板",
	});

	cli.onPromptComplete((answers: any, options: any) => {
		if (answers.features.includes("table")) {
			options.plugins["@tiger/plugin-table"] = {
				historyMode: answers.historyMode,
			};
		}
	});
};
