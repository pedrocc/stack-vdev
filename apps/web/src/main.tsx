import { ClerkProvider } from '@clerk/clerk-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SWRConfig } from 'swr'
import { App } from './App.js'
import { fetcher } from './lib/api.js'
import './styles/globals.css'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

if (!CLERK_KEY) {
	throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable')
}

const rootElement = document.getElementById('root')

if (!rootElement) {
	throw new Error('Root element not found')
}

createRoot(rootElement).render(
	<StrictMode>
		<ClerkProvider publishableKey={CLERK_KEY} afterSignOutUrl="/">
			<SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
				<App />
			</SWRConfig>
		</ClerkProvider>
	</StrictMode>
)
