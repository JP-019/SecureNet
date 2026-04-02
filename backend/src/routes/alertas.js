const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alertaController');
const { authenticateToken, checkRole } = require('../middleware/auth');

router.use(authenticateToken);

/**
 * @swagger
 * /api/alertas:
 *   get:
 *     summary: Obtener todas las alertas
 *     tags: [Alertas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [active, resolved, dismissed]
 *     responses:
 *       200:
 *         description: Lista de alertas
 */
router.get('/', alertaController.getAll);

/**
 * @swagger
 * /api/alertas:
 *   post:
 *     summary: Crear nueva alerta
 *     tags: [Alertas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - descripcion
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [movimiento, acceso, intrusion, equipo, emergencia]
 *               ubicacion:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               severidad:
 *                 type: string
 *                 enum: [baja, media, alta, critica]
 *     responses:
 *       201:
 *         description: Alerta creada
 */
router.post('/', checkRole('admin', 'guardia'), alertaController.create);

/**
 * @swagger
 * /api/alertas/{id}/status:
 *   put:
 *     summary: Actualizar estado de alerta
 *     tags: [Alertas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [active, resolved, dismissed]
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.put('/:id/status', checkRole('admin', 'recepcion'), alertaController.updateStatus);

module.exports = router;