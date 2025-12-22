import { $ } from 'bun'

async function healthCheck() {
	let hasErrors = false

	// Check Bun version
	const _bunVersion = await $`bun --version`.text()

	// Check TypeScript
	try {
		await $`bun run typecheck`.quiet()
	} catch {
		hasErrors = true
	}

	// Check Biome
	try {
		await $`bun run lint`.quiet()
	} catch {
		hasErrors = true
	}

	// Check database connection
	try {
		const dbCheck = await fetch('http://localhost:3000/health/ready')
		if (dbCheck.ok) {
		} else {
			hasErrors = true
		}
	} catch {}

	if (hasErrors) {
		process.exit(1)
	} else {
	}
}

healthCheck()
