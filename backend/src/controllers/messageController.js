const messageService = require('../services/messageService');

const getConversations = (req, res, next) => {
  try {
    const conversations = messageService.getConversations(req.user.id, req.user.empresaId);
    
    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = (req, res, next) => {
  try {
    const messages = messageService.getMessages(
      req.user.id, 
      req.params.destinatarioId, 
      req.user.empresaId
    );
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

const send = (req, res, next) => {
  try {
    const { destinatarioId, contenido } = req.body;
    
    if (!destinatarioId || !contenido) {
      return res.status(400).json({
        success: false,
        message: 'Destinatario y contenido son requeridos'
      });
    }

    const message = messageService.sendMessage(req.user.id, destinatarioId, contenido);
    
    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getConversations, getMessages, send };
