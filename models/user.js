const {DataTypes, Sequelize} = require('sequelize')

module.exports = (Sequelize) => {
    const Users = Sequelize.define('Users', {
        id : {
            type : DataTypes.UUID,
            defaultValue : DataTypes.UUIDV4,
            primaryKey : true
        },  
        user_name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        email_id : {
            type : DataTypes.STRING,
            unique : true,
            allowNull : false
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull : false
        }
    },{
        timestamps : true
    })
   
    console.log(Sequelize.models, 'Sequelize.models.orders')
    console.log("User model was synchronized successfully.");

    return Users
}