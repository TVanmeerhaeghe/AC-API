'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'buy_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Customers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'buy_by');
  }
};

