'use strict';
const { Model } = require('sequelize');

let Invoice;
let Estimate;

module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        static associate(models) {
            Invoice = models.Invoice;
            Estimate = models.Estimate;
        }
    }

    Task.init(
        {
            name: DataTypes.STRING(255),
            description: DataTypes.TEXT,
            hours: DataTypes.INTEGER,
            tva: {
                type: DataTypes.ENUM('0.00', '12.3', '21.20', '21.10', '20.00', '10.00'),
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
                    if (task.estimate_id) {
                        await Estimate.recalcTotals(task.estimate_id);
                    }
                },
                async afterUpdate(task) {
                    if (task.changed('invoice_id')) {
                        const oldInvoiceId = task.previous('invoice_id');
                        if (oldInvoiceId) {
                            await Invoice.recalcTotals(oldInvoiceId);
                        }
                        if (task.invoice_id) {
                            await Invoice.recalcTotals(task.invoice_id);
                        }
                    }
                    if (task.changed('estimate_id')) {
                        const oldEstimateId = task.previous('estimate_id');
                        if (oldEstimateId) {
                            await Estimate.recalcTotals(oldEstimateId);
                        }
                        if (task.estimate_id) {
                            await Estimate.recalcTotals(task.estimate_id);
                        }
                    }
                },
                async afterDestroy(task) {
                    if (task.invoice_id) {
                        await Invoice.recalcTotals(task.invoice_id);
                    }
                    if (task.estimate_id) {
                        await Estimate.recalcTotals(task.estimate_id);
                    }
                }
            }
        }
    );

    return Task;
};
