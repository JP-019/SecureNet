const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipoController');
const { authenticateToken, checkRole } = require('../middleware/auth');

router.use(authenticateToken);

/**
 * @swagger
 * /api/equipos:
 *   get:
 *     summary: Obtener todos los equipos
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipos
 */
router.get('/', checkRole('admin', 'recepcion'), equipoController.getAll);

/**
 * @swagger
 * /api/equipos/{id}:
 *   get:
 *     summary: Obtener equipo por ID
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipo encontrado
 */
router.get('/:id', equipoController.getById);

/**
 * @swagger
 * /api/equipos/{id}/members:
 *   post:
 *     summary: Agregar miembro a equipo
 *     tags: [Equipos]
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
 *               - usuarioId
 *             properties:
 *               usuarioId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Miembro agregado
 */
router.post('/:id/members', checkRole('admin', 'recepcion'), equipoController.addMember);

/**
 * @swagger
 * /api/equipos/{id}/members/{memberId}:
 *   delete:
 *     summary: Eliminar miembro de equipo
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Miembro eliminado
 */
router.delete('/:id/members/:memberId', checkRole('admin', 'recepcion'), equipoController.removeMember);

module.exports = router;