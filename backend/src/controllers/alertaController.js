const alertaService = require('../services/alertaService');

const getAll = (req, res, next) => {
  try {
    const alertas = alertaService.getAlertas(req.user.empresaId);
    
    res.json({
      success: true,
      data: alertas
    });
  } catch (error) {
    next(error);
  }
};

const create = (req, res, next) => {
  try {
    const alerta = alertaService.createAlerta(req.body, req.user.id);
    
    res.status(201).json({
      success: true,
      message: 'Alerta creada exitosamente',
      data: alerta
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = (req, res, next) => {
  try {
    const { estado } = req.body;
    const result = alertaService.updateAlertaStatus(req.params.id, estado);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create, updateStatus };
