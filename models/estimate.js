'use strict';
const { Model } = require('sequelize');
let Task;

module.exports = (sequelize, DataTypes) => {
    class Estimate extends Model {
        static associate(models) {
            Task = models.Task;
        }

        static async recalcTotals(estimateId) {
            const estimate = await Estimate.findByPk(estimateId);
            if (!estimate) return;
            const tasks = await Task.findAll({ where: { estimate_id: estimateId } });
            let totalBrutHT = 0;
            for (const task of tasks) {
                const taskHT = task.hours * task.hourly_rate;
                totalBrutHT += taskHT;
            }
            let discount = estimate.discount_value || 0;
            if (discount > totalBrutHT) {
                discount = totalBrutHT;
            }
            let totalHT = 0;
            let totalTVA = 0;
            for (const task of tasks) {
                const taskHT = task.hours * task.hourly_rate;
                const tvaRate = parseFloat(task.tva) / 100;
                const partRemise = discount * (taskHT / totalBrutHT);
                const taskHTAjuste = taskHT - partRemise;
                const taskTVA = taskHTAjuste * tvaRate;
                totalHT += taskHTAjuste;
                totalTVA += taskTVA;
            }
            estimate.total_ht = totalHT;
            estimate.total_tva = totalTVA;
            await estimate.save();
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
                type: DataTypes.ENUM('Brouillon', 'Envoyer', 'Approuver', 'Refuser')
            },
            admin_note: {
                type: DataTypes.TEXT
            },
            customer_id: {
                type: DataTypes.INTEGER
            },
            discount_name: {
                type: DataTypes.STRING(100)
            },
            discount_value: {
                type: DataTypes.FLOAT,
                defaultValue: 0
            },
            final_note: {
                type: DataTypes.TEXT
            }
        },
        {
            sequelize,
            modelName: 'Estimate',
            hooks: {
                async afterUpdate(estimate) {
                    if (estimate.changed('discount_value') || estimate.changed('discount_name')) {
                        await Estimate.recalcTotals(estimate.id);
                    }
                }
            }
        }
    );

    return Estimate;
};
