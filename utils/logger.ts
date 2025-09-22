// Structured logging utilities for observability
export interface LogContext {
  userId?: string;
  workspaceId?: string;
  sceneId?: string;
  requestId?: string;
  component?: string;
  action?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  error?: string;
  progress?: number;
  errorId?: string;
  componentStack?: string;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }

    return logEntry;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    const logEntry = this.formatLog(level, message, context, error);
    
    // In development, use console with colors
    if (this.isDevelopment) {
      const colors = {
        debug: '\x1b[36m', // cyan
        info: '\x1b[32m',  // green
        warn: '\x1b[33m',  // yellow
        error: '\x1b[31m'  // red
      };
      const reset = '\x1b[0m';
      
      console.log(`${colors[level]}[${level.toUpperCase()}]${reset} ${message}`, {
        context,
        error: error ? { name: error.name, message: error.message } : undefined
      });
    } else {
      // In production, use structured JSON logging
      console.log(JSON.stringify(logEntry));
    }

    // Send to external monitoring service in production
    if (!this.isDevelopment && level === 'error') {
      this.sendToMonitoring(logEntry);
    }
  }

  private sendToMonitoring(logEntry: LogEntry): void {
    // In a real application, you would send to services like:
    // - Sentry
    // - LogRocket
    // - DataDog
    // - CloudWatch
    // For now, we'll just log to console
    console.error('MONITORING:', JSON.stringify(logEntry));
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, context, error);
  }

  // Convenience methods for common scenarios
  userAction(action: string, context?: LogContext): void {
    this.info(`User action: ${action}`, { ...context, action });
  }

  apiCall(endpoint: string, method: string, context?: LogContext): void {
    this.info(`API call: ${method} ${endpoint}`, { ...context, action: 'api_call' });
  }

  componentError(component: string, error: Error, context?: LogContext): void {
    this.error(`Component error in ${component}`, error, { ...context, component });
  }

  processingStep(step: string, sceneId: string, context?: LogContext): void {
    this.info(`Processing step: ${step}`, { ...context, sceneId, action: 'processing' });
  }
}

// Export singleton instance
export const logger = new Logger();
