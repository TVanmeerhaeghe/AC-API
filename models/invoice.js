'use strict';
const { Model } = require('sequelize');

let Product, Task;

module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        static associate(models) {
            Product = models.Product;
            Task = models.Task;
        }

        static async recalcTotals(invoiceId) {
            const invoice = await Invoice.findByPk(invoiceId);
            if (!invoice) return;

            const tasks = await Task.findAll({
                where: { invoice_id: invoiceId }
            });

            let totalHT = 0;
            let totalTVA = 0;

            for (const task of tasks) {
                const taskHT = task.hours * task.hourly_rate;
                const tvaRate = parseFloat(task.tva) / 100;
                const taskTVA = taskHT * tvaRate;

                totalHT += taskHT;
                totalTVA += taskTVA;
            }

            if (invoice.product_id) {
                const product = await Product.findByPk(invoice.product_id);
                if (product) {
                    totalHT += product.price;
                }
            }

            invoice.total_ht = totalHT;
            invoice.total_tva = totalTVA;
            await invoice.save();
        }
    }

    Invoice.init(
        {
            creation_date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            validity_date: DataTypes.DATE,
            total_ht: {
                type: DataTypes.FLOAT,
                defaultValue: 0
            },
            total_tva: {
                type: DataTypes.FLOAT,
                defaultValue: 0
            },
            object: DataTypes.STRING(100),
            status: {
                type: DataTypes.ENUM('Brouillon', 'Envoyer', 'Payé', 'Annulé')
            },
            admin_note: DataTypes.TEXT,
            customer_id: DataTypes.INTEGER,
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Invoice',
            hooks: {
                async afterUpdate(invoice) {
                    if (invoice.changed('product_id')) {
                        await Invoice.recalcTotals(invoice.id);
                    }
                }
            }
        }
    );

    return Invoice;
};
