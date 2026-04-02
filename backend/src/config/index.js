module.exports = {
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'SecureNet-Secret-Key-2024-Min-32-Chars',
    expiresIn: '8h'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },
  apiKey: process.env.API_KEY || 'SecureNet-API-Key-2024'
};
