class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorTypes = {
  UNAUTHORIZED: (message = 'No autorizado') => new AppError(message, 401),
  FORBIDDEN: (message = 'Acceso denegado') => new AppError(message, 403),
  NOT_FOUND: (message = 'Recurso no encontrado') => new AppError(message, 404),
  BAD_REQUEST: (message = 'Solicitud inválida') => new AppError(message, 400),
  VALIDATION_ERROR: (message = 'Error de validación') => new AppError(message, 422),
  SERVER_ERROR: (message = 'Error interno del servidor') => new AppError(message, 500)
};

module.exports = { AppError, errorTypes };
