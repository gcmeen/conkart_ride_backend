require('dotenv').config();

const config = {
  development: {
    jwtSecret: 'conkart-secret-key',
    corsAllowOrigins: ['http://localhost:8081'],
    port: process.env.PORT || 8080,
    dbUrl: 'mongodb+srv://cdgodhani:6C2MVa3JkzQlwEaY@cluster0.fi4ftpg.mongodb.net/conkart_task',
    cookieSessionSecret: 'cookie-secret-key',
  },
  local: {
    jwtSecret: 'conkart-secret-key',
    corsAllowOrigins: ['http://localhost:8081'],
    port: process.env.PORT || 8080,
    dbUrl: 'mongodb+srv://cdgodhani:6C2MVa3JkzQlwEaY@cluster0.fi4ftpg.mongodb.net/conkart_task',
    cookieSessionSecret: 'cookie-secret-key',
  },
  production: {
    jwtSecret: 'conkart-secret-key',
    corsAllowOrigins: ['http://localhost:8081'],
    port: process.env.PORT || 8080,
    dbUrl: 'mongodb+srv://cdgodhani:6C2MVa3JkzQlwEaY@cluster0.fi4ftpg.mongodb.net/conkart_task',
    cookieSessionSecret: 'cookie-secret-key',
  },
};

module.exports = config[process.env.NODE_ENV];
