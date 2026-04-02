const mockData = require('../data/mockData');

const getDashboardStats = (empresaId) => {
  const usuariosEmpresa = mockData.usuarios.filter(u => u.empresaId === empresaId);
  const zonasEmpresa = mockData.zonas.filter(z => z.empresaId === empresaId);
  
  const guardias = usuariosEmpresa.filter(u => u.rol === 'guardia');
  const guardiasActivos = guardias.filter(u => u.estado === 'active' || u.estado === 'busy').length;
  
  const checkinsEmpresa = mockData.checkins.filter(c => {
    const usuario = mockData.usuarios.find(u => u.id === c.usuarioId);
    return usuario?.empresaId === empresaId;
  });
  
  const alertasActivas = mockData.alertas.filter(a => a.estado === 'active').length;
  const incidentesAbiertos = mockData.incidentes.filter(i => i.estado === 'investigacion' || i.estado === 'resuelto').length;
  const visitasHoy = mockData.visitas.filter(v => {
    const fechaVisita = new Date(v.fecha).toDateString();
    const hoy = new Date().toDateString();
    return fechaVisita === hoy && (v.estado === 'confirmada' || v.estado === 'pendiente');
  }).length;

  const cobertura = Math.round((guardiasActivos / Math.max(guardias.length, 1)) * 100);

  return {
    guardiasTotales: guardias.length,
    guardiasActivos,
    zonasActivas: zonasEmpresa.length,
    checkinsHoy: checkinsEmpresa.length,
    alertasActivas,
    incidentesAbiertos,
    visitasPendientes: visitasHoy,
    cobertura,
    promedioTiempoRespuesta: Math.floor(Math.random() * 10) + 5
  };
};

const getRecentActivity = (empresaId) => {
  const usuariosEmpresa = mockData.usuarios.filter(u => u.empresaId === empresaId);
  const usuarioIds = usuariosEmpresa.map(u => u.id);
  
  const checkinsRecientes = mockData.checkins
    .filter(c => usuarioIds.includes(c.usuarioId))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10)
    .map(c => {
      const usuario = mockData.usuarios.find(u => u.id === c.usuarioId);
      return {
        tipo: 'checkin',
        usuario: usuario ? { id: usuario.id, nombre: usuario.nombre, foto: usuario.foto } : null,
        zona: c.zona,
        timestamp: c.timestamp
      };
    });

  const alertasRecientes = mockData.alertas
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)
    .map(a => {
      const usuario = mockData.usuarios.find(u => u.id === a.usuarioId);
      return {
        tipo: 'alerta',
        usuario: usuario ? { id: usuario.id, nombre: usuario.nombre, foto: usuario.foto } : null,
        alerta: { tipo: a.tipo, severidad: a.severidad, descripcion: a.descripcion },
        timestamp: a.timestamp
      };
    });

  return [...checkinsRecientes, ...alertasRecientes].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 15);
};

const getAwsMetrics = () => {
  const { metricasAws, costosAws } = mockData;
  
  const totalCostos = costosAws.reduce((sum, c) => sum + c.costo, 0);

  return {
    recursos: {
      ec2: {
        actual: metricasAws.ec2.actual,
        maximo: metricasAws.ec2.maximo,
        instancia: metricasAws.ec2.instancia,
        porcentaje: Math.round((metricasAws.ec2.actual / metricasAws.ec2.maximo) * 100),
        costo: metricasAws.ec2.costo
      },
      rds: {
        actual: metricasAws.rds.actual,
        maximo: metricasAws.rds.maximo,
        tipo: metricasAws.rds.tipo,
        porcentaje: Math.round((metricasAws.rds.actual / metricasAws.rds.maximo) * 100),
        unidad: 'GB',
        costo: metricasAws.rds.costo
      },
      s3: {
        actual: metricasAws.s3.actual,
        maximo: metricasAws.s3.maximo,
        objetos: metricasAws.s3.objetos,
        porcentaje: Math.round((metricasAws.s3.actual / metricasAws.s3.maximo) * 100),
        unidad: 'GB',
        costo: metricasAws.s3.costo
      },
      cloudwatch: {
        metricas: metricasAws.cloudwatch.metricas,
        alarmas: metricasAws.cloudwatch.alarma,
        costo: metricasAws.cloudwatch.costo
      },
      lambda: {
        invocaciones: metricasAws.lambda.invocaciones,
        costo: metricasAws.lambda.costo
      },
      vpn: {
        conexiones: metricasAws.vpn.conexiones,
        uptime: metricasAws.vpn.uptime
      }
    },
    costos: costosAws,
    costoTotal: Math.round(totalCostos * 100) / 100
  };
};

const getZonas = (empresaId) => {
  if (empresaId) {
    return mockData.zonas.filter(z => z.empresaId === empresaId || !z.empresaId);
  }
  return mockData.zonas;
};

const getRoles = () => {
  return mockData.roles;
};

const getEmpresas = () => {
  return mockData.empresas;
};

const getVisitas = (empresaId) => {
  return mockData.visitas;
};

const getIncidentes = (empresaId) => {
  return mockData.incidentes;
};

const getReportes = (empresaId) => {
  return mockData.reportes;
};

module.exports = {
  getDashboardStats,
  getRecentActivity,
  getAwsMetrics,
  getZonas,
  getRoles,
  getEmpresas,
  getVisitas,
  getIncidentes,
  getReportes
};