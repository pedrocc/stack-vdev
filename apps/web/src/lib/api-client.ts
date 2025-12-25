import type { User } from '@repo/shared'
import useSWR, { type SWRConfiguration } from 'swr'
import { apiRequest, fetcher } from './api.js'

/**
 * API route constants - centralized route management
 */
export const apiRoutes = {
	users: {
		me: '/api/v1/users/me',
		list: '/api/v1/users',
		byId: (id: string) => `/api/v1/users/${id}`,
	},
	// Add more routes here as the API grows
	// auth: { ... },
	// posts: { ... },
} as const

/**
 * Typed SWR hook for fetching the current user
 */
export function useCurrentUser(config?: SWRConfiguration<User>) {
	return useSWR<User>(apiRoutes.users.me, fetcher, config)
}

/**
 * Typed SWR hook for fetching the list of users (admin only)
 */
export function useUsers(
	params?: { page?: number; limit?: number },
	config?: SWRConfiguration<User[]>
) {
	const queryString = params
		? `?${new URLSearchParams({
				page: String(params.page ?? 1),
				limit: String(params.limit ?? 10),
			})}`
		: ''

	return useSWR<User[]>(`${apiRoutes.users.list}${queryString}`, fetcher, config)
}

/**
 * Typed SWR hook for fetching a specific user by ID
 */
export function useUser(id: string | null, config?: SWRConfiguration<User>) {
	return useSWR<User>(id ? apiRoutes.users.byId(id) : null, fetcher, config)
}

/**
 * API mutation functions (non-SWR)
 */
export const api = {
	users: {
		/**
		 * Update a user
		 */
		update: async (id: string, data: Partial<User>) => {
			return apiRequest<User>(apiRoutes.users.byId(id), {
				method: 'PATCH',
				json: data,
			})
		},

		/**
		 * Create a user (webhook only)
		 */
		create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
			return apiRequest<User>(apiRoutes.users.list, {
				method: 'POST',
				json: data,
			})
		},
	},
	// Add more API methods here
}
