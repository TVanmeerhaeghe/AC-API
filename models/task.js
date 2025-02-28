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
                type: DataTypes.ENUM('12.3', '21.20', '21.10', '20.00', '10.00'),
                allowNull: false
            },
            hourly_rate: {
                type: DataTypes.FLOAT,
                allowNull: false
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
