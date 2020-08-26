export default (cli: any) => {
  cli.injectFeature({
    name: 'Babel',
    value: 'babel',
    short: 'Babel',
    description: 'Transpile modern JavaScript to older versions (for compatibility)',
    link: 'https://babeljs.io/',
    checked: true
  })

  cli.onPromptComplete((answers: any, options:any) => {
    if (answers.features.includes('ts')) {
      if (!answers.useTsWithBabel) {
        return
      }
    } else if (!answers.features.includes('babel')) {
      return
    }
    options.plugins['@vue/cli-plugin-babel'] = {}
  })
}
