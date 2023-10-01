const http = require('http');
const Sequelize = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();
const config = require('../config/default')[process.env.NODE_ENV || 'local'];
console.log(`Running on ${process.env.NODE_ENV}`)
console.log("config", config)
const App = require('../app')



const sequelize = new Sequelize(config.postgres.options);


function connectToPostgres() {
    sequelize.authenticate().then(() => {
        console.info('Connection has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    });

    return sequelize;
}

const postgresClient = connectToPostgres();
config.postgres.client = postgresClient;
sequelize.sync({ alter: true })

const app = App(config);
const port = process.env.PORT || "8504";
app.set("port", port);
const server = http.createServer(app);

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? `Pipe ${port}` : `Port  ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`)
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use`)
            process.exit(1);
            break;
        default:
            throw error;
    }
}

server.on("error", onError);
server.on('listening', () => {
    console.log(
        `Hi there! I'm listening on port ${server.address().port} in ${app.get('env')} mode.`,
    );
});

server.listen(port);
