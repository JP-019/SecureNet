const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión en el sistema
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - empresaId
 *               - usuario
 *               - password
 *             properties:
 *               empresaId:
 *                 type: string
 *                 description: ID de la empresa
 *                 example: "techcorp"
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: "Admin123*"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario logueado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyHeader: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
