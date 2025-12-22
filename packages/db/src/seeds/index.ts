import { db } from '../client.js'
import { users } from '../schema/index.js'

async function seed() {
	await db
		.insert(users)
		.values([
			{
				clerkId: 'user_seed_admin',
				email: 'admin@example.com',
				name: 'Admin User',
				role: 'admin',
			},
			{
				clerkId: 'user_seed_user',
				email: 'user@example.com',
				name: 'Regular User',
				role: 'user',
			},
		])
		.onConflictDoNothing()
}

seed()
	.catch(console.error)
	.finally(() => process.exit(0))
