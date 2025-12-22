import { existsSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'

const PORT = Number(process.env['PORT']) || 5173
const API_URL = process.env['API_URL'] || 'http://localhost:3000'

const MIME_TYPES: Record<string, string> = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.jsx': 'text/javascript',
	'.ts': 'text/javascript',
	'.tsx': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
}

const _server = Bun.serve({
	port: PORT,
	async fetch(req) {
		const url = new URL(req.url)
		const pathname = url.pathname

		// Proxy API requests
		if (pathname.startsWith('/api/') || pathname.startsWith('/health')) {
			const apiUrl = `${API_URL}${pathname}${url.search}`
			const headers = new Headers(req.headers)
			headers.delete('host')

			try {
				const response = await fetch(apiUrl, {
					method: req.method,
					headers,
					body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined,
				})

				return new Response(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers: response.headers,
				})
			} catch {
				return new Response(JSON.stringify({ error: 'API unavailable' }), {
					status: 503,
					headers: { 'Content-Type': 'application/json' },
				})
			}
		}

		// Serve static files from public directory
		if (pathname !== '/' && existsSync(join('./public', pathname))) {
			const filePath = join('./public', pathname)
			const ext = extname(filePath)
			const contentType = MIME_TYPES[ext] || 'application/octet-stream'

			return new Response(readFileSync(filePath), {
				headers: { 'Content-Type': contentType },
			})
		}

		// Handle TypeScript/TSX files with Bun's bundler
		if (pathname.endsWith('.ts') || pathname.endsWith('.tsx')) {
			const filePath = join('.', pathname)

			if (existsSync(filePath)) {
				const result = await Bun.build({
					entrypoints: [filePath],
					target: 'browser',
					format: 'esm',
					splitting: false,
					minify: false,
					define: {
						'process.env.NODE_ENV': '"development"',
						'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(
							process.env['CLERK_PUBLISHABLE_KEY'] || ''
						),
						'import.meta.env.VITE_API_URL': JSON.stringify(API_URL),
					},
				})

				if (result.success && result.outputs[0]) {
					const code = await result.outputs[0].text()
					return new Response(code, {
						headers: { 'Content-Type': 'text/javascript' },
					})
				}
			}
		}

		// Serve CSS files
		if (pathname.endsWith('.css')) {
			const filePath = join('.', pathname)
			if (existsSync(filePath)) {
				return new Response(readFileSync(filePath), {
					headers: { 'Content-Type': 'text/css' },
				})
			}
		}

		// Serve index.html for all other routes (SPA routing)
		const indexHtml = readFileSync('./index.html', 'utf-8')
		return new Response(indexHtml, {
			headers: { 'Content-Type': 'text/html' },
		})
	},
})
