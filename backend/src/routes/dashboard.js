const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, checkRole } = require('../middleware/auth');

router.use(authenticateToken);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Obtener estadísticas del dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del dashboard
 */
router.get('/stats', dashboardController.getStats);

/**
 * @swagger
 * /api/dashboard/activity:
 *   get:
 *     summary: Obtener actividad reciente
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actividad reciente
 */
router.get('/activity', dashboardController.getRecentActivity);

/**
 * @swagger
 * /api/dashboard/aws-metrics:
 *   get:
 *     summary: Obtener métricas de AWS
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas de AWS
 */
router.get('/aws-metrics', checkRole('admin'), dashboardController.getAwsMetrics);

/**
 * @swagger
 * /api/dashboard/catalogs:
 *   get:
 *     summary: Obtener catálogos (empresas, roles, zonas)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Catálogos del sistema
 */
router.get('/catalogs', dashboardController.getCatalogs);

/**
 * @swagger
 * /api/dashboard/visitas:
 *   get:
 *     summary: Obtener visitas programadas
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de visitas
 */
router.get('/visitas', dashboardController.getVisitas);

/**
 * @swagger
 * /api/dashboard/incidentes:
 *   get:
 *     summary: Obtener incidentes
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de incidentes
 */
router.get('/incidentes', dashboardController.getIncidentes);

/**
 * @swagger
 * /api/dashboard/reportes:
 *   get:
 *     summary: Obtener reportes
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes
 */
router.get('/reportes', dashboardController.getReportes);

module.exports = router;