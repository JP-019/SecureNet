const userService = require('../services/userService');

const getAll = (req, res, next) => {
  try {
    const users = userService.getAllUsers(req.user.empresaId);
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const getById = (req, res, next) => {
  try {
    const user = userService.getUserById(req.params.id, req.user.empresaId);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const create = (req, res, next) => {
  try {
    const user = userService.createUser(req.body, req.user.empresaId);
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const update = (req, res, next) => {
  try {
    const user = userService.updateUser(req.params.id, req.body, req.user.empresaId);
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const remove = (req, res, next) => {
  try {
    userService.deleteUser(req.params.id, req.user.empresaId);
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
