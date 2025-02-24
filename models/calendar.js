'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Calendar extends Model {
        static associate(models) {

        }
    }

    Calendar.init(
        {
            name: {
                type: DataTypes.STRING(255)
            },
            description: {
                type: DataTypes.TEXT
            },
            localisation: {
                type: DataTypes.STRING(255)
            },
            duration_time: {
                type: DataTypes.FLOAT
            },
            start_date: {
                type: DataTypes.DATE
            },
            end_date: {
                type: DataTypes.DATE
            },
            customer_id: {
                type: DataTypes.INTEGER
            }
        },
        {
            sequelize,
            modelName: 'Calendar'
        }
    );

    return Calendar;
};
