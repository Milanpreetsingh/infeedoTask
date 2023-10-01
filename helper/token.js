const jwt = require('jsonwebtoken')
const config = require('../config/default')[process.env.NODE_ENV || 'local']

let Token = async (userId) => {
    try{
    console.log("inside token")
    console.log("userId", userId)

    const payload = {
        user: {
            id: userId
        }
    };

    let token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: 3600 })
    return token
}
catch(e){
    console.log("inside server error", e)
    throw new Error(e);
}

}

let RefreshToken = async (userId) => {
    try{
    console.log("inside refresh token")
    console.log("userId", userId)

    const payload = {
        user: {
            id: userId
        }
    };

    let refreshToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: 3600000 })
    return refreshToken
}
catch(e){
    console.log("inside server error", e)
    throw new Error(e);
}

}

module.exports = {RefreshToken, Token}