import execa from 'execa'

export default function executeCommand(command:string, args:any, targetDir:string) {
    return new Promise((resolve, reject) => {
        const apiMode = process.env.VUE_CLI_API_MODE
        if (apiMode) {
            if (command === 'npm') {
              // TODO when this is supported
            } else if (command === 'yarn') {
              args.push('--json')
            }
        }
        const child = execa(command, args, { 
            cwd: targetDir,
            stdio: ['inherit', apiMode ? 'pipe' : 'inherit', !apiMode && command === 'yarn' ? 'pipe' : 'inherit']
        })

        child.on('close', code => {
            if (code !== 0) {
              reject(`command failed: ${command} ${args.join(' ')}`)
              return
            }
            resolve()
        })
    })
}