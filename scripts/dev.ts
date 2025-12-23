import { spawn } from 'bun'

const DEFAULT_API_PORT = 3000
const DEFAULT_WEB_PORT = 5173

async function isPortAvailable(port: number): Promise<boolean> {
	try {
		const server = Bun.serve({
			port,
			fetch() {
				return new Response()
			},
		})
		server.stop()
		return true
	} catch {
		return false
	}
}

async function findAvailablePort(startPort: number): Promise<number> {
	let port = startPort
	while (!(await isPortAvailable(port))) {
		port++
		if (port > startPort + 100) {
			throw new Error(`Não foi possível encontrar porta disponível a partir de ${startPort}`)
		}
	}
	return port
}

const processes: ReturnType<typeof spawn>[] = []

function cleanup() {
	for (const proc of processes) {
		proc.kill()
	}
	process.exit(0)
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

// Find available ports
const apiPort = await findAvailablePort(DEFAULT_API_PORT)
const webPort = await findAvailablePort(DEFAULT_WEB_PORT)

if (apiPort !== DEFAULT_API_PORT) {
	console.log(`⚠️  Porta ${DEFAULT_API_PORT} ocupada, usando porta ${apiPort} para API`)
}
if (webPort !== DEFAULT_WEB_PORT) {
	console.log(`⚠️  Porta ${DEFAULT_WEB_PORT} ocupada, usando porta ${webPort} para Web`)
}

console.log(`🚀 Iniciando API em http://localhost:${apiPort}`)
console.log(`🌐 Iniciando Web em http://localhost:${webPort}`)

// Start API
const api = spawn({
	cmd: ['bun', 'run', '--filter', '@repo/api', 'dev'],
	stdout: 'inherit',
	stderr: 'inherit',
	env: {
		...process.env,
		PORT: String(apiPort),
		WEB_URL: `http://localhost:${webPort}`,
	},
})
processes.push(api)

// Start Web
const web = spawn({
	cmd: ['bun', 'run', '--filter', '@repo/web', 'dev'],
	stdout: 'inherit',
	stderr: 'inherit',
	env: {
		...process.env,
		PORT: String(webPort),
		API_URL: `http://localhost:${apiPort}`,
	},
})
processes.push(web)

await Promise.all(processes.map((p) => p.exited))
