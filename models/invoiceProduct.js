'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class InvoiceProduct extends Model {
        static associate(models) { }
    }
    InvoiceProduct.init({
        invoice_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Invoices', key: 'id' }
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Products', key: 'id' }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        sequelize,
        modelName: 'InvoiceProduct',
        tableName: 'invoice_products'
    });
    return InvoiceProduct;
};
