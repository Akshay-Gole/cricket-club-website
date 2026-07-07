import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import logger from '../../services/logger'

interface Props {
  children: ReactNode
  name?: string
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error(
      `ErrorBoundary caught an error${this.props.name ? ` in ${this.props.name}` : ''}`,
      error,
      { componentStack: errorInfo.componentStack }
    )
  }

  handleReset = (): void => {
    this.setState({ hasError: false })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 text-center">
          <h1 className="font-['Bebas_Neue'] text-gold text-5xl tracking-[3px] mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Our team has been notified
          </p>
          <button
            onClick={this.handleReset}
            className="font-['Bebas_Neue'] bg-gold text-black px-8 py-3 text-xl tracking-[2px] hover:bg-[#b89640] transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
