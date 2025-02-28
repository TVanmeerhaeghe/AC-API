'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Invoices', 'discount_name', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
    await queryInterface.addColumn('Invoices', 'discount_value', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false
    });
    await queryInterface.changeColumn('Tasks', 'tva', {
      type: Sequelize.ENUM('0.00', '12.3', '21.20', '21.10', '20.00', '10.00'),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Invoices', 'discount_name');
    await queryInterface.removeColumn('Invoices', 'discount_value');
    await queryInterface.changeColumn('Tasks', 'tva', {
      type: Sequelize.ENUM('12.3', '21.20', '21.10', '20.00', '10.00'),
      allowNull: false
    });
  }
};

