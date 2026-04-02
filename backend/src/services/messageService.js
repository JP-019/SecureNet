const { v4: uuidv4 } = require('uuid');
const mockData = require('../data/mockData');
const { errorTypes } = require('../models/errors');

const getConversations = (userId, empresaId) => {
  const userConversations = new Map();

  mockData.mensajes.forEach(msg => {
    const otherId = msg.remitenteId === userId ? msg.destinatarioId : msg.remitenteId;
    
    if (!userConversations.has(otherId)) {
      const otherUser = mockData.usuarios.find(u => u.id === otherId && u.empresaId === empresaId);
      if (otherUser) {
        userConversations.set(otherId, {
          usuarioId: otherId,
          nombre: otherUser.nombre,
          rol: otherUser.rol,
          estado: otherUser.estado,
          ultimoMensaje: msg.contenido,
          timestamp: msg.timestamp,
          noLeidos: 0
        });
      }
    }

    if (msg.destinatarioId === userId && !msg.leido) {
      const conv = userConversations.get(otherId);
      if (conv) conv.noLeidos++;
    }
  });

  return Array.from(userConversations.values())
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const getMessages = (userId, destinatarioId, empresaId) => {
  const messages = mockData.mensajes.filter(msg => 
    (msg.remitenteId === userId && msg.destinatarioId === destinatarioId) ||
    (msg.remitenteId === destinatarioId && msg.destinatarioId === userId)
  ).map(msg => {
    const remitente = mockData.usuarios.find(u => u.id === msg.remitenteId);
    return {
      id: msg.id,
      contenido: msg.contenido,
      timestamp: msg.timestamp,
      leido: msg.leido,
      esMio: msg.remitenteId === userId,
      remitente: remitente ? {
        id: remitente.id,
        nombre: remitente.nombre
      } : null
    };
  });

  mockData.mensajes.forEach(msg => {
    if (msg.destinatarioId === userId && msg.remitenteId === destinatarioId) {
      msg.leido = true;
    }
  });

  return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

const sendMessage = (remitenteId, destinatarioId, contenido) => {
  const destinatario = mockData.usuarios.find(u => u.id === destinatarioId);
  
  if (!destinatario) {
    throw errorTypes.NOT_FOUND('Destinatario no encontrado');
  }

  const newMessage = {
    id: uuidv4(),
    remitenteId,
    destinatarioId,
    contenido,
    timestamp: new Date().toISOString(),
    leido: false
  };

  mockData.mensajes.push(newMessage);

  return {
    id: newMessage.id,
    contenido: newMessage.contenido,
    timestamp: newMessage.timestamp,
    leido: newMessage.leido,
    esMio: true
  };
};

module.exports = { getConversations, getMessages, sendMessage };
