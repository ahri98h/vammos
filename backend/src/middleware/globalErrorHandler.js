/**
 * Global Error Handler Middleware
 * Centraliza tratamento de erros com logging estruturado
 */

const logger = require('../utils/logger');
const Sentry = require('@sentry/node');

/**
 * Controller para erro 404
 */
const handle404 = (req, res) => {
  return res.status(404).json({
    success: false,
    error: 'Not Found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
};

/**
 * Custom Error Class
 */
class AppError extends Error {
  constructor(message, statusCode, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date();
  }
}

/**
 * Global Error Handler
 * NOTA: Deve ser o último middleware registrado
 */
const globalErrorHandler = (err, req, res, next) => {
  const errorId = req.id || 'unknown';
  
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';
  
  // Tratamento específico por tipo de erro
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid request data';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    code = 'UNAUTHORIZED';
    message = 'Authentication required';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    code = 'FORBIDDEN';
    message = 'Access denied';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = 'Resource not found';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    code = 'SERVICE_UNAVAILABLE';
    message = 'Service temporarily unavailable';
  }
  
  // Log estruturado
  const logContext = {
    errorId,
    statusCode,
    code,
    message,
    userId: req.user?.id,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent')
  };
  
  if (statusCode >= 500) {
    logger.error('Application Error', {
      ...logContext,
      stack: err.stack,
      details: err
    });
    // Também enviar para Sentry
    if (Sentry) {
      Sentry.captureException(err, { 
        tags: { errorId, code },
        contexts: { request: logContext }
      });
    }
  } else if (statusCode >= 400) {
    logger.warn('Client Error', logContext);
  }
  
  // Response
  res.status(statusCode).json({
    success: false,
    error: message,
    code,
    errorId,
    timestamp: new Date().toISOString(),
    // Em produção, não retorne detalhes internos
    ...(process.env.NODE_ENV === 'development' && {
      details: err.details || null,
      stack: err.stack?.split('\n').slice(0, 5)
    })
  });
};

/**
 * Async route wrapper para capturar erros
 * USO: router.post('/route', asyncHandler(controller.action))
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  globalErrorHandler,
  handle404,
  AppError,
  asyncHandler
};
