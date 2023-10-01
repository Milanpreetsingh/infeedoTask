const express = require('express')
const router = express.Router()
const taskRoute = require("./task")
const userRoute = require("./user")
module.exports = (config) => {
    try {
        router.get('/v1/infeedo/task-manager/health', (req, res) => {
            res.send('Health OK');
        });
        router.use('/v1/infeedo/task-manager/tasks', taskRoute(config))
        router.use('/v1/infeedo/task-manager/users', userRoute(config))
        return router;
    } catch (err) {
        console.log(err, 'err from index')
        throw new Error("Server Error")
    }
};