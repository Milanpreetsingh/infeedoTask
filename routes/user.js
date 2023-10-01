
const express = require('express')
const router = new express.Router()
const UserService = require("../services/user")
const TaskService = require("../services/task")
const { Token, RefreshToken } = require("../helper/token")
const bcrypt = require('bcryptjs')

module.exports = (config) => {

    console.log("config.postgres.client", config.postgres.client)
    const userService = new UserService(config.postgres.client)
    const taskService = new TaskService(config.postgres.client)

    //api to register new user
    router.post('/register', async (req, res) => {
        try {
            console.log("inside register api")
            let { body } = req

            let user = await userService.createUser(body)

            if (user.success == false) {
                return res.status(409).send({ "message": user.message })
            }
            let obj = JSON.parse(JSON.stringify(user))
            delete obj.password

            res.send({ "message": "User created successfully", "user": obj })

        }
        catch (e) {
            console.log("inside register api error", e)
            res.status(500).send({ "message": "Server Error", "error": e.message })
        }
    })

    //api to login the user and it will give jwt token for session management in the response headers and refresh token in the cookies
    router.post('/login', async (req, res) => {
        try {
            console.log("inside login api")
            let { body } = req
            let user = await userService.getUserByEmail(body.email_id)
            const isMatch = await bcrypt.compare(req.body.password, user.password)

            if (!isMatch) {
                return res.status(401).send({ "message": "Please enter the valid password" })
            }
            let token = await Token(user.id)
            let refreshToken = await RefreshToken(user.id)

            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' }).header('access_token', token).send({ "message": "Logged in successfully" });
        }
        catch (e) {
            res.status(500).send({ "message": "Server Error", "error": e.message })
        }
    })

    return router
}