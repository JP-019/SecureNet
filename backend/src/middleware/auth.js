const jwt = require('jsonwebtoken');
const config = require('../config');
const { errorTypes } = require('../models/errors');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(errorTypes.UNAUTHORIZED('Token de acceso requerido'));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return next(errorTypes.UNAUTHORIZED('Token inválido o expirado'));
  }
};

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== config.apiKey) {
    return next(errorTypes.FORBIDDEN('API Key inválida'));
  }

  next();
};

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(errorTypes.UNAUTHORIZED());
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return next(errorTypes.FORBIDDEN('No tienes permisos para esta acción'));
    }

    next();
  };
};

module.exports = { authenticateToken, verifyApiKey, checkRole };
