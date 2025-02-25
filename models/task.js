'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        static associate(models) {

        }
    }

    Task.init(
        {
            name: {
                type: DataTypes.STRING(255)
            },
            description: {
                type: DataTypes.TEXT
            },
            hours: {
                type: DataTypes.INTEGER
            },
            tva: {
                type: DataTypes.FLOAT
            },
            invoice_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            estimate_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Task'
        }
    );

    return Task;
};
