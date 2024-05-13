require('dotenv').config();

const config = {
  development: {
    jwtSecret: process.env.JWT_SECERT,
    corsAllowOrigins: [process.env.CORS_ORIGINS],
    port: process.env.PORT || 8080,
    dbUrl: process.env.DBURL,
    cookieSessionSecret: process.env.COOKER_SECRET,
  },
  local: {
    jwtSecret: process.env.JWT_SECERT,
    corsAllowOrigins: [process.env.CORS_ORIGINS],
    port: process.env.PORT || 8080,
    dbUrl: process.env.DBURL,
    cookieSessionSecret: process.env.COOKER_SECRET,
  },
  production: {
    jwtSecret: process.env.JWT_SECERT,
    corsAllowOrigins: [process.env.CORS_ORIGINS],
    port: process.env.PORT || 8080,
    dbUrl: process.env.DBURL,
    cookieSessionSecret: process.env.COOKER_SECRET,
  },
};

module.exports = config[process.env.NODE_ENV];
