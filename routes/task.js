
const express = require('express')
const router = new express.Router()
const UserService = require("../services/user")
const TaskService = require("../services/task")
const auth = require("../middleware/auth")

module.exports = (config) => {

    console.log("config.postgres.client", config.postgres.client)
    const userService = new UserService(config.postgres.client)
    const taskService = new TaskService(config.postgres.client)

    //api to create new task
    router.post('/create', auth, async (req, res) => {
        try {
            console.log("inside create task api")
            let { body } = req
            body.user_id = req.user.id

            let task = await taskService.createTask(body)

            let obj = JSON.parse(JSON.stringify(task))
            delete obj.password

            res.header('access_token', req.token).send({ "message": "Task created successfully", "Task": obj })

        }
        catch (e) {
            console.log("inside create task api error", e)
            res.status(500).send({ "message": "Server Error", "error": e.message })
        }
    })

    //api to get all the tasks of the user
    router.get('/me', auth, async (req, res) => {
        try {
            console.log("inside get all tasks api")
            let { pageNo, pageSize } = req.query;
            console.log(pageNo, "pageNo", pageSize, "pageSize")
            console.log(req.token, "token")
            pageNo = parseInt(pageNo);
            pageSize = parseInt(pageSize);

            let { tasks, totalTasks } = await taskService.getAllTasksByUserId({ "user_id": req.user.id, "pageNo": pageNo, "pageSize": pageSize })

            res.header('access_token', req.token).send({ "tasks": tasks, "pageNo": pageNo, "pageSize": tasks.length, "totalCount": totalTasks })

        } catch (e) {
            console.log("inside get all task by user api error", e)
            res.status(500).send({ "message": "Server Error", "error": e.message })
        }
    })

    //api to update the task
    router.patch("/update/:taskId", auth, async (req, res) => {
        try {
            console.log("inside update task api")

            const keys = Object.keys(req.body)
            const allowed = ["description", "title", "status", "priority", "due_date"]

            const check = keys.every((i) => { return allowed.includes(i) })

            console.log("keys", keys)
            console.log("check", check)

            if (!check) {
                return res.status(400).send({ error: "invalid updates" })
            }

            let id = req.params.taskId
            let user_id = req.user.id

            let updatedTask = await taskService.updateTaskByTaskId({ "user_id": user_id, "id": id, "body": req.body })
            console.log("updatedTask", updatedTask)

            if (updatedTask[0] == 0) {
                return res.status(404).send({ "message": "Task not found for the logged in user" })
            }

            res.header('access_token', req.token).send({ "message": "Successfully updated", "updatedTask": updatedTask })
        } catch (e) {
            console.log("inside update api error", e)
            res.status(500).send({ "message": "Server Error", "error": e.message })
        }
    })

    // api to get metrics
    router.get("/metrics", auth, async (req, res) => {
        try {
            console.log("inside metrics task api")
            let metricsData = await taskService.getTasksMetricsByUserId({ "user_id": req.user.id })

            res.header('access_token', req.token).send({ "metricsData": metricsData })
        }
        catch (e) {
            console.log("inside metrics api error", e)
            res.status(500).send({ "message": "Server Error", "error": e.message })
        }
    })

    return router
}