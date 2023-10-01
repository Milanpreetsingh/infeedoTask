const jwt = require('jsonwebtoken');
const config = require('../config/default')[process.env.NODE_ENV || 'local']
const UserService = require("../services/user")
const { Token } = require("../helper/token")



module.exports = async function (req, res, next) {
    try {
        console.log("inside auth")
        const token = req.header('x-auth-token');

        // check if not token
        if (!token) {
            return res.status(401).send({ "message": 'No token, Authorization denied' });
        }

        const decodedToken = jwt.verify(token, config.JWT_SECRET);

        const userService = new UserService(config.postgres.client)

        console.log("decodedToken", decodedToken)

        let userResp = await userService.getUserById(decodedToken.user.id)

        if(!userResp){
            return res.status(401).send({ "message": 'User not found' })
        }
        req.user = decodedToken.user
        req.token = token
        
        next();
    } catch (e) { 
        try{
        // here refreshing the access token using refresh token if access token is expired
        console.log("inside error token", e)
        const refreshToken = req.cookies.refreshToken
        console.log("refreshToken", refreshToken)
        const decodedRefreshToken = jwt.verify(refreshToken, config.JWT_SECRET);

        const userService = new UserService(config.postgres.client)
        let userResp = await userService.getUserById(decodedRefreshToken.user.id)

        if(!userResp){
            return res.status(401).send({ "message": 'User not found' })
        }
        
        req.user = decodedRefreshToken.user
        req.token = await Token(decodedRefreshToken.user.id)
        next()

        }
        catch(e){
            console.log("inside error refresh token", e)
            res.status(401).send({ "message": 'Your session has been expired, Please login again' });
        }
    }
};