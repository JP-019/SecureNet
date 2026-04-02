const dashboardService = require('../services/dashboardService');

const getStats = (req, res, next) => {
  try {
    const stats = dashboardService.getDashboardStats(req.user.empresaId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

const getRecentActivity = (req, res, next) => {
  try {
    const activity = dashboardService.getRecentActivity(req.user.empresaId);
    
    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    next(error);
  }
};

const getAwsMetrics = (req, res, next) => {
  try {
    const metrics = dashboardService.getAwsMetrics();
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
};

const getCatalogs = (req, res, next) => {
  try {
    const zonas = dashboardService.getZonas(req.user.empresaId);
    const roles = dashboardService.getRoles();
    const empresas = dashboardService.getEmpresas();
    
    res.json({
      success: true,
      data: { zonas, roles, empresas }
    });
  } catch (error) {
    next(error);
  }
};

const getVisitas = (req, res, next) => {
  try {
    const visitas = dashboardService.getVisitas(req.user.empresaId);
    
    res.json({
      success: true,
      data: visitas
    });
  } catch (error) {
    next(error);
  }
};

const getIncidentes = (req, res, next) => {
  try {
    const incidentes = dashboardService.getIncidentes(req.user.empresaId);
    
    res.json({
      success: true,
      data: incidentes
    });
  } catch (error) {
    next(error);
  }
};

const getReportes = (req, res, next) => {
  try {
    const reportes = dashboardService.getReportes(req.user.empresaId);
    
    res.json({
      success: true,
      data: reportes
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getStats, 
  getRecentActivity, 
  getAwsMetrics, 
  getCatalogs,
  getVisitas,
  getIncidentes,
  getReportes
};