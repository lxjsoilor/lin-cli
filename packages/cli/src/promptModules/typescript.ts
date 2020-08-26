export default (cli: any) => {
  cli.injectFeature({
    name: 'TypeScript',
    value: 'ts',
    short: 'TS',
    description: 'Add support for the TypeScript language',
    link: 'https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript',
    plugins: ['typescript']
  })

  cli.injectPrompt({
    name: 'tsClassComponent',
    when: (answers: any) => answers.features.includes('ts'),
    type: 'confirm',
    message: 'Use class-style component syntax?',
    description: 'Use the @Component decorator on classes.',
    link: 'https://vuejs.org/v2/guide/typescript.html#Class-Style-Vue-Components',
    default: true
  })

  cli.injectPrompt({
    name: 'useTsWithBabel',
    when: (answers: any) => answers.features.includes('ts'),
    type: 'confirm',
    message: 'Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)?',
    description: 'It will output ES2015 and delegate the rest to Babel for auto polyfill based on browser targets.',
    default: (answers: any) => answers.features.includes('babel')
  })

  cli.onPromptComplete((answers: any, options:any) => {
    if (answers.features.includes('ts')) {
      const tsOptions: any = {
        classComponent: answers.tsClassComponent
      }
      if (answers.eslintConfig === 'tslint') {
        tsOptions.tsLint = true
        tsOptions.lintOn = answers.lintOn
      }
      if (answers.useTsWithBabel) {
        tsOptions.useTsWithBabel = true
      }
      options.plugins['@vue/cli-plugin-typescript'] = tsOptions
    }
  })
}
