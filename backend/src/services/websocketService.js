const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const config = require('../config');
const mockData = require('../data/mockData');

const clients = new Map();
const userSockets = new Map();

const getTokenFromUrl = (url) => {
  try {
    const urlObj = new URL(url, 'http://localhost');
    return urlObj.searchParams.get('token');
  } catch {
    return null;
  }
};

const authenticateWebSocket = (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = mockData.usuarios.find(u => u.id === decoded.userId);
    return user || null;
  } catch {
    return null;
  }
};

const broadcastToCompany = (empresaId, message) => {
  clients.forEach((client, ws) => {
    if (client.empresaId === empresaId && ws.readyState === 1) {
      ws.send(JSON.stringify(message));
    }
  });
};

const broadcastToRole = (rol, message) => {
  clients.forEach((client, ws) => {
    if (client.rol === rol && ws.readyState === 1) {
      ws.send(JSON.stringify(message));
    }
  });
};

const sendToUser = (userId, message) => {
  const ws = userSockets.get(userId);
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify(message));
    return true;
  }
  return false;
};

const handleWebSocketConnection = (ws, req) => {
  const token = getTokenFromUrl(req.url);
  const user = authenticateWebSocket(token);

  if (!user) {
    ws.close(4001, 'Unauthorized');
    return;
  }

  const clientId = uuidv4();
  const clientInfo = {
    id: clientId,
    userId: user.id,
    nombre: user.nombre,
    empresaId: user.empresaId,
    rol: user.rol
  };

  clients.set(ws, clientInfo);
  userSockets.set(user.id, ws);

  console.log(`[WS] Usuario conectado: ${user.nombre} (${user.rol})`);

  ws.send(JSON.stringify({
    type: 'connection',
    payload: {
      clientId,
      user: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol,
        empresaId: user.empresaId
      },
      message: 'Conectado exitosamente'
    }
  }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      handleMessage(ws, message, clientInfo);
    } catch (e) {
      console.error('[WS] Error al parsear mensaje:', e);
    }
  });

  ws.on('close', () => {
    const client = clients.get(ws);
    if (client) {
      console.log(`[WS] Usuario desconectado: ${client.nombre}`);
      clients.delete(ws);
      userSockets.delete(client.userId);
      broadcastToCompany(client.empresaId, {
        type: 'user_disconnected',
        payload: { userId: client.userId, nombre: client.nombre }
      });
    }
  });

  ws.on('error', (error) => {
    console.error('[WS] Error:', error.message);
  });
};

const handleMessage = (ws, message, clientInfo) => {
  const { type, payload } = message;

  switch (type) {
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', payload: { timestamp: new Date().toISOString() } }));
      break;

    case 'send_message':
      handleSendMessage(ws, payload, clientInfo);
      break;

    case 'send_alert':
      handleSendAlert(ws, payload, clientInfo);
      break;

    case 'checkin':
      handleCheckin(ws, payload, clientInfo);
      break;

    case 'join_room':
      console.log(`[WS] ${clientInfo.nombre} se unió a sala: ${payload.room}`);
      break;

    case 'typing':
      const recipientWs = userSockets.get(payload.destinatarioId);
      if (recipientWs && recipientWs.readyState === 1) {
        recipientWs.send(JSON.stringify({
          type: 'user_typing',
          payload: {
            usuarioId: clientInfo.userId,
            nombre: clientInfo.nombre
          }
        }));
      }
      break;

    case 'mark_read':
      handleMarkRead(ws, payload, clientInfo);
      break;

    default:
      console.log(`[WS] Tipo de mensaje desconocido: ${type}`);
  }
};

const handleSendMessage = (ws, payload, clientInfo) => {
  const { destinatarioId, contenido } = payload;
  const destinatario = mockData.usuarios.find(u => u.id === destinatarioId);

  if (!destinatario) {
    ws.send(JSON.stringify({
      type: 'error',
      payload: { message: 'Destinatario no encontrado' }
    }));
    return;
  }

  const newMessage = {
    id: uuidv4(),
    remitenteId: clientInfo.userId,
    destinatarioId,
    contenido,
    timestamp: new Date().toISOString(),
    leido: false
  };

  mockData.mensajes.push(newMessage);

  const remitenteInfo = {
    id: clientInfo.userId,
    nombre: clientInfo.nombre
  };

  ws.send(JSON.stringify({
    type: 'message_sent',
    payload: {
      id: newMessage.id,
      contenido: newMessage.contenido,
      timestamp: newMessage.timestamp,
      leido: newMessage.leido,
      esMio: true,
      remitente: remitenteInfo
    }
  }));

  const recipientWs = userSockets.get(destinatarioId);
  if (recipientWs && recipientWs.readyState === 1) {
    recipientWs.send(JSON.stringify({
      type: 'new_message',
      payload: {
        id: newMessage.id,
        contenido: newMessage.contenido,
        timestamp: newMessage.timestamp,
        leido: newMessage.leido,
        esMio: false,
        remitente: remitenteInfo
      }
    }));
  }

  broadcastToCompany(clientInfo.empresaId, {
    type: 'message_notification',
    payload: {
      remitenteId: clientInfo.userId,
      destinatarioId,
      contenido: contenido.substring(0, 50) + (contenido.length > 50 ? '...' : '')
    }
  });
};

const handleSendAlert = (ws, payload, clientInfo) => {
  const { tipo, ubicacion, descripcion, severidad } = payload;

  const newAlert = {
    id: uuidv4(),
    tipo: tipo || 'general',
    ubicacion: ubicacion || 'desconocida',
    descripcion,
    severidad: severidad || 'media',
    usuarioId: clientInfo.userId,
    timestamp: new Date().toISOString(),
    estado: 'active',
    evidencia: null
  };

  mockData.alertas.unshift(newAlert);

  const alertMessage = {
    type: 'new_alert',
    payload: {
      id: newAlert.id,
      tipo: newAlert.tipo,
      ubicacion: newAlert.ubicacion,
      descripcion: newAlert.descripcion,
      severidad: newAlert.severidad,
      timestamp: newAlert.timestamp,
      usuario: {
        id: clientInfo.userId,
        nombre: clientInfo.nombre
      }
    }
  };

  clients.forEach((client, clientWs) => {
    if (client.empresaId === clientInfo.empresaId && clientWs.readyState === 1) {
      clientWs.send(JSON.stringify(alertMessage));
    }
  });

  if (severidad === 'critica' || severidad === 'alta') {
    clients.forEach((client, clientWs) => {
      if (client.rol === 'admin' || client.rol === 'supervisor') {
        clientWs.send(JSON.stringify({
          type: 'critical_alert',
          payload: alertMessage.payload
        }));
      }
    });
  }

  ws.send(JSON.stringify({
    type: 'alert_created',
    payload: newAlert
  }));
};

const handleCheckin = (ws, payload, clientInfo) => {
  const { zonaId, lat, lng, notas } = payload;

  const newCheckin = {
    id: uuidv4(),
    usuarioId: clientInfo.userId,
    zona: zonaId,
    timestamp: new Date().toISOString(),
    lat: lat || 19.4326,
    lng: lng || -99.1332,
    notas
  };

  mockData.checkins.unshift(newCheckin);

  const user = mockData.usuarios.find(u => u.id === clientInfo.userId);
  if (user) {
    user.ultimoAcceso = newCheckin.timestamp;
  }

  ws.send(JSON.stringify({
    type: 'checkin_confirmed',
    payload: {
      id: newCheckin.id,
      zona: newCheckin.zona,
      timestamp: newCheckin.timestamp
    }
  }));

  broadcastToCompany(clientInfo.empresaId, {
    type: 'user_checkin',
    payload: {
      usuarioId: clientInfo.userId,
      nombre: clientInfo.nombre,
      zona: zonaId,
      timestamp: newCheckin.timestamp
    }
  });
};

const handleMarkRead = (ws, payload, clientInfo) => {
  const { mensajeId } = payload;

  mockData.mensajes.forEach(msg => {
    if (msg.id === mensajeId && msg.destinatarioId === clientInfo.userId) {
      msg.leido = true;
    }
  });

  ws.send(JSON.stringify({
    type: 'message_read',
    payload: { mensajeId }
  }));
};

module.exports = {
  handleWebSocketConnection,
  broadcastToCompany,
  broadcastToRole,
  sendToUser
};