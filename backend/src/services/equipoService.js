const { v4: uuidv4 } = require('uuid');
const mockData = require('../data/mockData');
const { errorTypes } = require('../models/errors');

const getEquipos = (empresaId) => {
  return mockData.equipos
    .filter(e => e.empresaId === empresaId)
    .map(equipo => {
      const miembros = mockData.usuarios.filter(u => u.id === equipo.miembros);
      const zona = mockData.zonas.find(z => z.id === equipo.zona);
      
      return {
        id: equipo.id,
        nombre: equipo.nombre,
        zona: zona || null,
        miembros: miembros.map(u => ({
          id: u.id,
          nombre: u.nombre,
          rol: u.rol,
          estado: u.estado
        }))
      };
    });
};

const getEquipoById = (equipoId, empresaId) => {
  const equipo = mockData.equipos.find(
    e => e.id === equipoId && e.empresaId === empresaId
  );

  if (!equipo) {
    throw errorTypes.NOT_FOUND('Equipo no encontrado');
  }

  const miembros = mockData.usuarios.filter(u => equipo.miembros.includes(u.id));
  const zona = mockData.zonas.find(z => z.id === equipo.zona);

  return {
    id: equipo.id,
    nombre: equipo.nombre,
    zona: zona || null,
    miembros: miembros.map(u => ({
      id: u.id,
      nombre: u.nombre,
      rol: u.rol,
      estado: u.estado,
      telefono: u.telefono
    }))
  };
};

const addMemberToTeam = (equipoId, usuarioId, empresaId) => {
  const equipo = mockData.equipos.find(
    e => e.id === equipoId && e.empresaId === empresaId
  );

  if (!equipo) {
    throw errorTypes.NOT_FOUND('Equipo no encontrado');
  }

  const user = mockData.usuarios.find(
    u => u.id === usuarioId && u.empresaId === empresaId
  );

  if (!user) {
    throw errorTypes.NOT_FOUND('Usuario no encontrado');
  }

  if (equipo.miembros.includes(usuarioId)) {
    throw errorTypes.BAD_REQUEST('El usuario ya es miembro del equipo');
  }

  equipo.miembros.push(usuarioId);

  return { success: true, message: 'Miembro agregado al equipo' };
};

const removeMemberFromTeam = (equipoId, usuarioId, empresaId) => {
  const equipo = mockData.equipos.find(
    e => e.id === equipoId && e.empresaId === empresaId
  );

  if (!equipo) {
    throw errorTypes.NOT_FOUND('Equipo no encontrado');
  }

  const memberIndex = equipo.miembros.indexOf(usuarioId);
  
  if (memberIndex === -1) {
    throw errorTypes.NOT_FOUND('El usuario no es miembro del equipo');
  }

  equipo.miembros.splice(memberIndex, 1);

  return { success: true, message: 'Miembro removido del equipo' };
};

module.exports = { getEquipos, getEquipoById, addMemberToTeam, removeMemberFromTeam };
