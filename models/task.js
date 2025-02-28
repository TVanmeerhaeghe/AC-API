'use strict';
const { Model } = require('sequelize');

let Invoice;

module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        static associate(models) {
            Invoice = models.Invoice;
        }
    }

    Task.init(
        {
            name: DataTypes.STRING(255),
            description: DataTypes.TEXT,
            hours: DataTypes.INTEGER,
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
            modelName: 'Task',
            hooks: {
                async afterCreate(task) {
                    if (task.invoice_id) {
                        await Invoice.recalcTotals(task.invoice_id);
                    }
                },
                async afterUpdate(task) {
                    if (task.changed('invoice_id')) {
                        const oldInvoiceId = task.previous('invoice_id');
                        if (oldInvoiceId) {
                            await Invoice.recalcTotals(oldInvoiceId);
                        }
                    }
                    if (task.invoice_id) {
                        await Invoice.recalcTotals(task.invoice_id);
                    }
                },
                async afterDestroy(task) {
                    if (task.invoice_id) {
                        await Invoice.recalcTotals(task.invoice_id);
                    }
                }
            }
        }
    );

    return Task;
};
