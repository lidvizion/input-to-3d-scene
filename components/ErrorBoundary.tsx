'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { logger } from '@/utils/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  errorId?: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return { 
      hasError: true, 
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { errorId } = this.state
    
    // Log error with structured logging
    logger.componentError('ErrorBoundary', error, {
      errorId,
      componentStack: errorInfo.componentStack || undefined
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Update state with error info
    this.setState({ errorInfo })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
            <div className="text-center">
              {/* Error Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>

              {/* Error Message */}
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Something went wrong
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>

              {/* Error ID for support */}
              {this.state.errorId && (
                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 mb-6">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Error ID:
                  </p>
                  <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                    {this.state.errorId}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={this.handleGoHome}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>Go Home</span>
                  </button>

                  <button
                    onClick={this.handleReload}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reload</span>
                  </button>
                </div>
              </div>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                    <pre className="text-xs text-red-800 dark:text-red-200 whitespace-pre-wrap overflow-auto">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

export default ErrorBoundary
