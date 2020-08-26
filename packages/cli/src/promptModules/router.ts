export default (cli: any) => {
  cli.injectFeature({
    name: 'Router',
    value: 'router',
    description: 'Structure the app with dynamic pages',
    link: 'https://router.vuejs.org/'
  })

  cli.injectPrompt({
    name: 'historyMode',
    when: (answers: any) => answers.features.includes('router'),
    type: 'confirm',
    message: `vue-router 使用 history 模式?`,
    description: `通过使用HTML5 API, url不需要“#”字符了。`,
    link: 'https://router.vuejs.org/guide/essentials/history-mode.html'
  })

  cli.onPromptComplete((answers: any, options: any) => {
    if (answers.features.includes('router')) {
      options.plugins['@vue/cli-plugin-router'] = {
        historyMode: answers.historyMode
      }
    }
  })
}