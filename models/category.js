'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {

        }
    }

    Category.init(
        {
            name: {
                type: DataTypes.STRING(255)
            },
            description: {
                type: DataTypes.TEXT
            }
        },
        {
            sequelize,
            modelName: 'Category'
        }
    );

    return Category;
};
