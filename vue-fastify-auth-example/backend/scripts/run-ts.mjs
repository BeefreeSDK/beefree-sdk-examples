import { spawn } from 'node:child_process'

const nodeMajor = Number.parseInt(process.versions.node.split('.')[0] ?? '0', 10)
const passthroughArgs = process.argv.slice(2)

const command = nodeMajor >= 22
  ? process.execPath
  : process.platform === 'win32'
    ? 'tsx.cmd'
    : 'tsx'

const commandArgs = nodeMajor >= 22
  ? ['--experimental-strip-types', ...passthroughArgs]
  : passthroughArgs

const child = spawn(command, commandArgs, {
  stdio: 'inherit',
  shell: false,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})
