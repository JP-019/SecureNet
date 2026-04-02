const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, checkRole } = require('../middleware/auth');

router.use(authenticateToken);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyHeader: []
 *     parameters:
 *       - in: query
 *         name: empresaId
 *         schema:
 *           type: string
 *         description: Filtrar por empresa
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', checkRole('admin', 'recepcion'), userController.getAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
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
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', userController.getById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - nombre
 *               - password
 *               - rol
 *               - empresaId
 *             properties:
 *               usuario:
 *                 type: string
 *               nombre:
 *                 type: string
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [admin, supervisor, recepcion, guardia]
 *               empresaId:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post('/', checkRole('admin'), userController.create);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
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
 *         description: Usuario actualizado
 */
router.put('/:id', checkRole('admin'), userController.update);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
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
 *         description: Usuario eliminado
 */
router.delete('/:id', checkRole('admin'), userController.remove);

module.exports = router;