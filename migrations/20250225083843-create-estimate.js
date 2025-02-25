'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Estimates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      creation_date: {
        type: Sequelize.DATE
      },
      validity_date: {
        type: Sequelize.DATE
      },
      total_ht: {
        type: Sequelize.FLOAT
      },
      total_tva: {
        type: Sequelize.FLOAT
      },
      object: {
        type: Sequelize.STRING(100)
      },
      status: {
        type: Sequelize.ENUM('Brouillon', 'Envoyer', 'Approuver', 'Refuser')
      },
      admin_note: {
        type: Sequelize.TEXT
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      discount: {
        type: Sequelize.FLOAT
      },
      final_note: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Estimates');
  }
};

