const pjs = require("../package.json");
const { name, version } = pjs;

module.exports = {
  local: {
    name,
    version,
    postgres: {
      options: {
        host: "localhost",
        port: 5432,
        database: "postgres",
        dialect: "postgres",
        username: "postgres",
        password: "Infeedo@123",
        logging: false,
        retry: {
          match: [/Deadlock/i],
          max: 3, // Maximum rety 3 times
          backoffBase: 1000, // Initial backoff duration in ms. Default: 100,
          backoffExponent: 1.5, // Exponent to increase backoff each try. Default: 1.1
        },
      },
    },
    client: null,
    JWT_SECRET: "infeedo_taskManagerTest"
  },
  production: {
    // here you can add configs for production environment
  }
  
};
