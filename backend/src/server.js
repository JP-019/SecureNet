const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const multer = require('multer');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { verifyApiKey } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const equipoRoutes = require('./routes/equipos');
const messageRoutes = require('./routes/messages');
const alertaRoutes = require('./routes/alertas');
const dashboardRoutes = require('./routes/dashboard');
const { handleWebSocketConnection } = require('./services/websocketService');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'perfiles');
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
});

app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SecureNet API',
      version: '1.0.0',
      description: 'API del sistema de control de guardias y mensajería en tiempo real',
      contact: {
        name: 'Soporte SecureNet',
        email: 'soporte@securenet.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        apiKeyHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        }
      }
    },
    security: [{ bearerAuth: [] }, { apiKeyHeader: [] }]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SecureNet API Docs',
  customfavIcon: '/favicon.ico'
}));
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.post('/api/upload/perfil', upload.single('foto'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se proporcionó imagen' });
    }
    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        path: `/uploads/perfiles/${req.file.filename}`,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    next(error);
  }
});

app.use('/uploads/perfiles', express.static(path.join(__dirname, '..', 'uploads', 'perfiles')));

wss.on('connection', (ws, req) => {
  handleWebSocketConnection(ws, req);
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║           SecureNet Backend Server               ║
╠═══════════════════════════════════════════════════╣
║  Status:  ✅ Running                            ║
║  Port:    ${String(PORT).padEnd(42)}║
║  WS Port: ${String(PORT).padEnd(42)}║
║  Swagger: http://localhost:${PORT}/api-docs         ║
║  API Key: ${config.apiKey.substring(0, 20)}...${''.padEnd(17)}║
╚═══════════════════════════════════════════════════╝
  `);
});

module.exports = { app, server, wss, upload };
