const express = require("express");
const cookieParser = require('cookie-parser');

const app = express();

const routes = require("./routes");

const cors = require("cors");

module.exports = (config) => {
    var corsOptions = {
        origin: "*",

        optionsSuccessStatus: 200,

        methods: "GET, PUT,POST, DELETE, PATCH",
    };

    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: true }));

    app.use(express.json());

    app.use("/api", routes(config));

    return app;
};
