import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { $ } from 'bun'

const args = process.argv.slice(2)
const nameArg = args.find((a) => a.startsWith('--name='))
const descArg = args.find((a) => a.startsWith('--description='))

if (!nameArg) {
	process.exit(1)
}

const projectName = nameArg.split('=')[1]
const description = descArg?.split('=')[1] ?? ''

// Validate name (kebab-case)
if (!projectName || !/^[a-z][a-z0-9-]*$/.test(projectName)) {
	process.exit(1)
}

// Files to update
const filesToUpdate = ['package.json', 'apps/api/package.json', 'apps/web/package.json']

for (const file of filesToUpdate) {
	try {
		const content = readFileSync(file, 'utf-8')
		const updated = content
			.replaceAll('stack-vdev', projectName)
			.replace(/"description":\s*""/, `"description": "${description}"`)
		writeFileSync(file, updated)
	} catch {}
}

// Remove .git if exists
try {
	rmSync('.git', { recursive: true, force: true })
} catch {
	// No .git to remove
}

// Initialize new git repo
await $`git init`

// Copy .env.example to .env
try {
	const envExample = readFileSync('.env.example', 'utf-8')
	writeFileSync('.env', envExample)
} catch {}
await $`bun install`
