const { DataTypes, Sequelize } = require('sequelize')
module.exports = (Sequelize) => {
    const Tasks = Sequelize.define('Tasks', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            foreignKey: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
        },
        priority: {
            type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
            defaultValue: 'LOW'
        },
        status: {
            type: DataTypes.ENUM('TO_DO', 'IN_PROGRESS', 'COMPLETED'),
            defaultValue: 'TO_DO'
        },
        due_date: {
            type: DataTypes.DATE
        }
    }, {
        timeStamps: true,
    })

    Tasks.belongsTo(Sequelize.models.Users, {
        as: 'user',
        foreignKey: 'user_id'
    })

    Sequelize.models.Users.hasMany(Tasks, {
        as: 'task',
        foreignKey: 'user_id'
    })
    

    console.log(Sequelize.models, 'Sequelize.models.Tasks')
    console.log("Tasks model was synchronized successfully.");
    return Tasks
}