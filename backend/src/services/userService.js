const { v4: uuidv4 } = require('uuid');
const mockData = require('../data/mockData');
const { errorTypes } = require('../models/errors');
const User = require('../models/User');

const getAllUsers = (empresaId) => {
  return mockData.usuarios
    .filter(u => u.empresaId === empresaId)
    .map(u => User.fromData(u).toPublic());
};

const getUserById = (userId, empresaId) => {
  const user = mockData.usuarios.find(u => u.id === userId && u.empresaId === empresaId);
  
  if (!user) {
    throw errorTypes.NOT_FOUND('Usuario no encontrado');
  }

  return User.fromData(user).toPublic();
};

const createUser = (userData, empresaId) => {
  const existingUser = mockData.usuarios.find(
    u => u.empresaId === empresaId && u.usuario === userData.usuario
  );

  if (existingUser) {
    throw errorTypes.BAD_REQUEST('El nombre de usuario ya existe');
  }

  const newUserData = {
    empresaId,
    usuario: userData.usuario,
    password: userData.password || 'Temp123*',
    nombre: userData.nombre,
    rol: userData.rol,
    email: userData.email,
    telefono: userData.telefono,
    zona: userData.zona,
    estado: 'active'
  };

  const newUser = User.fromData(newUserData);
  mockData.usuarios.push(newUser);

  return newUser.toPublic();
};

const updateUser = (userId, userData, empresaId) => {
  const userIndex = mockData.usuarios.findIndex(
    u => u.id === userId && u.empresaId === empresaId
  );

  if (userIndex === -1) {
    throw errorTypes.NOT_FOUND('Usuario no encontrado');
  }

  const user = mockData.usuarios[userIndex];
  
  if (userData.nombre) user.nombre = userData.nombre;
  if (userData.email) user.email = userData.email;
  if (userData.telefono) user.telefono = userData.telefono;
  if (userData.rol) user.rol = userData.rol;
  if (userData.zona) user.zona = userData.zona;
  if (userData.estado) user.estado = userData.estado;
  if (userData.password) user.password = userData.password;

  mockData.usuarios[userIndex] = user;

  return User.fromData(user).toPublic();
};

const deleteUser = (userId, empresaId) => {
  const userIndex = mockData.usuarios.findIndex(
    u => u.id === userId && u.empresaId === empresaId
  );

  if (userIndex === -1) {
    throw errorTypes.NOT_FOUND('Usuario no encontrado');
  }

  mockData.usuarios.splice(userIndex, 1);

  return true;
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
