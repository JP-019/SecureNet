const { AppError } = require('../models/errors');

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  }

  console.error('Error no manejado:', err);

  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Error interno del servidor'
  });
};

const notFoundHandler = (req, res, next) => {
  next(new AppError(`No encontrado: ${req.originalUrl}`, 404));
};

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const message = error.details.map(d => d.message).join(', ');
      return next(new AppError(message, 400));
    }
    
    next();
  };
};

module.exports = { errorHandler, notFoundHandler, validateRequest };
