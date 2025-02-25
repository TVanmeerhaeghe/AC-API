'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Estimate extends Model {
        static associate(models) {

        }
    }

    Estimate.init(
        {
            creation_date: {
                type: DataTypes.DATE
            },
            validity_date: {
                type: DataTypes.DATE
            },
            total_ht: {
                type: DataTypes.FLOAT
            },
            total_tva: {
                type: DataTypes.FLOAT
            },
            object: {
                type: DataTypes.STRING(100)
            },
            status: {
                type: DataTypes.ENUM('Brouillon', 'Envoyer', 'Approuver', 'Refuser')
            },
            admin_note: {
                type: DataTypes.TEXT
            },
            customer_id: {
                type: DataTypes.INTEGER
            },
            discount: {
                type: DataTypes.FLOAT
            },
            final_note: {
                type: DataTypes.TEXT
            }
        },
        {
            sequelize,
            modelName: 'Estimate'
        }
    );

    return Estimate;
};
