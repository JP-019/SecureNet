const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

/**
 * @swagger
 * /api/messages/conversations:
 *   get:
 *     summary: Obtener conversaciones del usuario
 *     tags: [Mensajería]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de conversaciones
 */
router.get('/conversations', messageController.getConversations);

/**
 * @swagger
 * /api/messages/{destinatarioId}:
 *   get:
 *     summary: Obtener mensajes con un usuario
 *     tags: [Mensajería]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: destinatarioId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de mensajes
 */
router.get('/:destinatarioId', messageController.getMessages);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Enviar mensaje
 *     tags: [Mensajería]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - destinatarioId
 *               - contenido
 *             properties:
 *               destinatarioId:
 *                 type: string
 *               contenido:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensaje enviado
 */
router.post('/', messageController.send);

module.exports = router;