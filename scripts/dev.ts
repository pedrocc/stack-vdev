import { spawn } from 'bun'

const processes: ReturnType<typeof spawn>[] = []

function cleanup() {
	for (const proc of processes) {
		proc.kill()
	}
	process.exit(0)
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

// Start API
const api = spawn({
	cmd: ['bun', 'run', '--filter', '@repo/api', 'dev'],
	stdout: 'inherit',
	stderr: 'inherit',
})
processes.push(api)

// Start Web
const web = spawn({
	cmd: ['bun', 'run', '--filter', '@repo/web', 'dev'],
	stdout: 'inherit',
	stderr: 'inherit',
})
processes.push(web)

await Promise.all(processes.map((p) => p.exited))
