module.exports = {
	name: "tiger",
	site: {
		defaultLang: "zh-CN",
		versions: [{
			label: "1.x",
			link: ""
		}],
		locales: {
			"zh-CN": {
				title: "Tiger",
				description: "Vue 组件库",
				logo: "http://work.it.hucais.com/Skin/U7/U7_S1/images/logo_S.png",
				langLabel: "中文",
				nav: [{
						title: "介绍",
						path: "home",
					},
					{
						title: "开发指南",
						items: [{
								path: "home",
								title: "介绍",
							},
							{
								path: "Init",
								title: "init",
							},
						],
					},

					{
						title: "基础组件",
						items: [{
							path: "button",
							title: "按钮",
						}, ],
					},
					{
						title: "基础组件Test",
						items: [{
							path: "test",
							title: "按钮test",
						}, ],
					},
				],
			},
		},
	},
};