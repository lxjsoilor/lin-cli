export default (cli: any) => {
  cli.injectFeature({
    name: 'Admin',
    value: 'admin',
    description: '选择中后台模板',
    // link: 'https://router.vuejs.org/'
  })

  cli.onPromptComplete((answers: any, options: any) => {
    if (answers.features.includes('admin')) {
      options.plugins['@tiger/plugin-admin'] = {
        historyMode: answers.historyMode
      }
    }
  })
}