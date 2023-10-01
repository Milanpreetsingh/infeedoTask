const Models = require('../models/task')
const Sequelize = require('sequelize');

class taskService {
    constructor(sequelize) {
        Models(sequelize)
        this.client = sequelize
        this.models = sequelize.models
    }

    async createTask(data) {
        try {
            console.log("inside create task")

            let newTask = await this.models.Tasks.create(data)
            return newTask
        }
        catch (e) {
            console.log("inside createTask error", e)
            throw new Error(e)
        }

    }

    async getAllTasksByUserId(args) {
        try {
            console.log("inside getAllTasksByUserId")
            let { user_id, pageNo, pageSize } = args

            const offset = (pageNo - 1) * pageSize;

            const { rows: tasks, count: totalTasks } = await this.models.Tasks.findAndCountAll({
                where: {
                    user_id: user_id
                },
                offset,
                limit: pageSize,
            });

            return { tasks, totalTasks };
        }
        catch (e) {
            console.log("inside getAllTasksByUserId error", e)
            throw new Error(e)
        }
    }

    async updateTaskByTaskId(args) {
        try {
            console.log("inside updateTaskByTaskId")
            let { user_id, id, body } = args
            const updatedTask = await this.models.Tasks.update(
                body,
                {
                    where: {
                        id: id,
                        user_id: user_id
                    },
                }
            );

            return updatedTask
        }
        catch (e) {
            console.log("inside updateTaskByTaskId error", e)
            throw new Error(e)
        }
    }

    async getTasksMetricsByUserId(args) {
        try {
            console.log("inside getTasksMetricsByUserId")
            let { user_id } = args

            const metricsData = await this.models.Tasks.findAll({
                where: {
                    user_id: user_id
                },
                attributes: [
                    'createdAt',
                    'status',
                    [Sequelize.fn('COUNT', Sequelize.col('status')), 'count'],
                ],
                group: [ 'createdAt', 'status'],
            })

            return metricsData

        } catch (e) {
            console.log("inside getTasksMetricsByUserId error", e)
            throw new Error(e)
        }
    }
}

module.exports = taskService