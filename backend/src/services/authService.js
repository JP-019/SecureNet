const jwt = require('jsonwebtoken');
const config = require('../config');
const mockData = require('../data/mockData');
const { errorTypes } = require('../models/errors');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      usuario: user.usuario,
      nombre: user.nombre,
      rol: user.rol,
      empresaId: user.empresaId
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

const login = (empresaId, username, password) => {
  const empresa = mockData.empresas.find(e => e.id === empresaId);
  
  if (!empresa) {
    throw errorTypes.NOT_FOUND('Empresa no encontrada');
  }

  const user = mockData.usuarios.find(
    u => u.empresaId === empresaId && 
         u.usuario === username && 
         u.password === password
  );

  if (!user) {
    throw errorTypes.UNAUTHORIZED('Credenciales inválidas');
  }

  if (user.estado === 'inactive') {
    throw errorTypes.FORBIDDEN('Usuario inactivo');
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      usuario: user.usuario,
      rol: user.rol,
      email: user.email,
      estado: user.estado
    },
    empresa: {
      id: empresa.id,
      nombre: empresa.nombre
    }
  };
};

const getProfile = (userId) => {
  const user = mockData.usuarios.find(u => u.id === userId);
  
  if (!user) {
    throw errorTypes.NOT_FOUND('Usuario no encontrado');
  }

  const empresa = mockData.empresas.find(e => e.id === user.empresaId);

  return {
    id: user.id,
    nombre: user.nombre,
    usuario: user.usuario,
    rol: user.rol,
    email: user.email,
    telefono: user.telefono,
    estado: user.estado,
    zona: user.zona,
    empresa: empresa ? { id: empresa.id, nombre: empresa.nombre } : null
  };
};

module.exports = { login, getProfile, generateToken };
