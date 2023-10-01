const Models = require('../models/user')
const bcrypt = require('bcryptjs')

class userService {
    constructor(sequelize) {
        Models(sequelize)
        this.client = sequelize
        this.models = sequelize.models
    }

    async createUser(data) {
        try {
            console.log("inside create user")
            let userResponse = await this.models.Users.findOne({
                where: {
                    email_id: data.email_id
                },
            });

            if (userResponse) {
                return { "success": false, "message": "User already exists" }
            }

            if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?=.{8,})/).test(data.password)) {
                throw new Error('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.');
            }

            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);

            let newUser = await this.models.Users.create(data)
            return newUser
        }
        catch (e) {
            console.log("inside createUser error", e)
            throw new Error(e)
        }

    }

    async getUserByEmail(email_id) {
        try {
            let userResponse = await this.models.Users.findOne({
                where: {
                    email_id: email_id
                },
            });

            if (!userResponse) {
                throw new Error('Email id not found')
            }

            return userResponse

        } catch (e) {
            throw new Error(e)
        }
    }

    async getUserById(id) {
        try {
            let userResponse = await this.models.Users.findOne({
                where: {
                    id: id
                },
            });

            return userResponse

        } catch (e) {
            throw new Error(e)
        }
    }

}

module.exports = userService