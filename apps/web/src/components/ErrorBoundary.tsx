import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
	children: ReactNode
}

interface ErrorBoundaryState {
	hasError: boolean
	error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false, error: undefined }
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error }
	}

	override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error('Error caught by boundary:', error, errorInfo)
	}

	override render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
						<div className="mb-6">
							<svg
								className="mx-auto h-12 w-12 text-red-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<h1 className="text-2xl font-bold text-gray-900 mb-4">Algo deu errado</h1>
						<p className="text-gray-600 mb-6">
							{this.state.error?.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
						</p>
						<div className="space-y-3">
							<button
								type="button"
								onClick={() => window.location.reload()}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
							>
								Recarregar página
							</button>
							<button
								type="button"
								onClick={() => (window.location.href = '/')}
								className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
							>
								Voltar ao início
							</button>
						</div>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}
