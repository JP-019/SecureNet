const { v4: uuidv4 } = require('uuid');
const mockData = require('../data/mockData');
const { errorTypes } = require('../models/errors');

const getAlertas = (empresaId) => {
  return mockData.alertas.map(alerta => {
    const usuario = mockData.usuarios.find(u => u.id === alerta.usuarioId);
    const zona = mockData.zonas.find(z => z.id === alerta.ubicacion);
    
    return {
      id: alerta.id,
      tipo: alerta.tipo,
      ubicacion: zona || null,
      descripcion: alerta.descripcion,
      severidad: alerta.severidad,
      usuario: usuario ? { id: usuario.id, nombre: usuario.nombre } : null,
      timestamp: alerta.timestamp,
      estado: alerta.estado
    };
  });
};

const createAlerta = (alertaData, usuarioId) => {
  const newAlerta = {
    id: uuidv4(),
    tipo: alertaData.tipo,
    ubicacion: alertaData.ubicacion,
    descripcion: alertaData.descripcion,
    severidad: alertaData.severidad || 'media',
    usuarioId,
    timestamp: new Date().toISOString(),
    estado: 'active'
  };

  mockData.alertas.push(newAlerta);

  const zona = mockData.zonas.find(z => z.id === newAlerta.ubicacion);

  return {
    id: newAlerta.id,
    tipo: newAlerta.tipo,
    ubicacion: zona || null,
    descripcion: newAlerta.descripcion,
    severidad: newAlerta.severidad,
    timestamp: newAlerta.timestamp,
    estado: newAlerta.estado
  };
};

const updateAlertaStatus = (alertaId, estado) => {
  const alertaIndex = mockData.alertas.findIndex(a => a.id === alertaId);

  if (alertaIndex === -1) {
    throw errorTypes.NOT_FOUND('Alerta no encontrada');
  }

  mockData.alertas[alertaIndex].estado = estado;

  return { success: true, estado };
};

module.exports = { getAlertas, createAlerta, updateAlertaStatus };
