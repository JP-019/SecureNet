const authService = require('../services/authService');

const login = (req, res, next) => {
  try {
    const { empresaId, usuario, password } = req.body;
    
    if (!empresaId || !usuario || !password) {
      return res.status(400).json({
        success: false,
        message: 'Empresa, usuario y contraseña son requeridos'
      });
    }

    const result = authService.login(empresaId, usuario, password);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = (req, res, next) => {
  try {
    const profile = authService.getProfile(req.user.id);
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getProfile };
