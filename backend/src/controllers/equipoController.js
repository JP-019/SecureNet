const equipoService = require('../services/equipoService');

const getAll = (req, res, next) => {
  try {
    const equipos = equipoService.getEquipos(req.user.empresaId);
    
    res.json({
      success: true,
      data: equipos
    });
  } catch (error) {
    next(error);
  }
};

const getById = (req, res, next) => {
  try {
    const equipo = equipoService.getEquipoById(req.params.id, req.user.empresaId);
    
    res.json({
      success: true,
      data: equipo
    });
  } catch (error) {
    next(error);
  }
};

const addMember = (req, res, next) => {
  try {
    const { usuarioId } = req.body;
    const result = equipoService.addMemberToTeam(req.params.id, usuarioId, req.user.empresaId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const removeMember = (req, res, next) => {
  try {
    const result = equipoService.removeMemberFromTeam(
      req.params.id, 
      req.params.memberId, 
      req.user.empresaId
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, addMember, removeMember };
