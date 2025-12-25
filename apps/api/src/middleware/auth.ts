import { verifyToken } from '@clerk/backend'
import { db, users } from '@repo/db'
import { eq } from 'drizzle-orm'
import type { Context } from 'hono'
import { createMiddleware } from 'hono/factory'
import { commonErrors, errorResponse } from '../lib/response.js'

export type AuthVariables = {
	userId: string
	sessionId: string
}

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
	const authHeader = c.req.header('Authorization')

	if (!authHeader?.startsWith('Bearer ')) {
		return commonErrors.unauthorized(c, 'Missing or invalid authorization header')
	}

	const token = authHeader.slice(7)

	const secretKey = process.env['CLERK_SECRET_KEY']
	if (!secretKey) {
		return errorResponse(c, 'CONFIGURATION_ERROR', 'Server misconfigured', 500)
	}

	try {
		const payload = await verifyToken(token, {
			secretKey,
		})

		c.set('userId', payload.sub)
		c.set('sessionId', payload.sid ?? '')

		await next()
	} catch {
		return commonErrors.unauthorized(c, 'Invalid token')
	}
})

export function getAuth(c: Context<{ Variables: AuthVariables }>) {
	return {
		userId: c.get('userId'),
		sessionId: c.get('sessionId'),
	}
}

export const requireAdmin = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
	const { userId } = getAuth(c)

	const user = await db.query.users.findFirst({
		where: eq(users.clerkId, userId),
	})

	if (!user || user.role !== 'admin') {
		return commonErrors.forbidden(c, 'Admin access required')
	}

	await next()
})
