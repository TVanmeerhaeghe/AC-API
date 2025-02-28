'use strict';
const { Model } = require('sequelize');
let Task;
let Product;

module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        static associate(models) {
            Task = models.Task;
            Product = models.Product;
        }

        static async recalcTotals(invoiceId) {
            const invoice = await Invoice.findByPk(invoiceId);
            if (!invoice) return;
            let totalHT = 0;
            let totalTVA = 0;

            if (invoice.product_id) {
                const product = await Product.findByPk(invoice.product_id);
                if (product) {
                    let price = product.price || 0;
                    let discount = invoice.discount_value || 0;
                    if (discount > price) discount = price;
                    totalHT = price - discount;
                    totalTVA = 0;
                }
            } else {
                const tasks = await Task.findAll({ where: { invoice_id: invoiceId } });
                let totalBrutHT = 0;
                for (const task of tasks) {
                    const lineHT = task.hours * task.hourly_rate;
                    totalBrutHT += lineHT;
                }
                let discount = invoice.discount_value || 0;
                if (discount > totalBrutHT) discount = totalBrutHT;
                for (const task of tasks) {
                    const lineHT = task.hours * task.hourly_rate;
                    const tvaRate = parseFloat(task.tva) / 100;
                    const partRemise = discount * (lineHT / totalBrutHT);
                    const adjustedHT = lineHT - partRemise;
                    totalHT += adjustedHT;
                    totalTVA += adjustedHT * tvaRate;
                }
            }

            invoice.total_ht = totalHT < 0 ? 0 : totalHT;
            invoice.total_tva = totalTVA < 0 ? 0 : totalTVA;
            await invoice.save();
        }
    }

    Invoice.init(
        {
            creation_date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            validity_date: {
                type: DataTypes.DATE
            },
            total_ht: {
                type: DataTypes.FLOAT,
                defaultValue: 0
            },
            total_tva: {
                type: DataTypes.FLOAT,
                defaultValue: 0
            },
            object: {
                type: DataTypes.STRING(100)
            },
            status: {
                type: DataTypes.ENUM('Brouillon', 'Envoyer', 'Payé', 'Annulé')
            },
            admin_note: {
                type: DataTypes.TEXT
            },
            customer_id: {
                type: DataTypes.INTEGER
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            discount_name: {
                type: DataTypes.STRING(100)
            },
            discount_value: {
                type: DataTypes.FLOAT,
                defaultValue: 0
            }
        },
        {
            sequelize,
            modelName: 'Invoice',
            hooks: {
                async afterCreate(invoice) {
                    await Invoice.recalcTotals(invoice.id);
                },
                async afterUpdate(invoice) {
                    await Invoice.recalcTotals(invoice.id);
                }
            }
        }
    );

    return Invoice;
};
