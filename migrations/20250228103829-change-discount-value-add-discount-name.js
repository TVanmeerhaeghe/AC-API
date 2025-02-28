'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Estimates', 'discount', 'discount_value');
    await queryInterface.changeColumn('Estimates', 'discount_value', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('Estimates', 'discount_name', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Estimates', 'discount_name');
    await queryInterface.changeColumn('Estimates', 'discount_value', {
      type: Sequelize.FLOAT
    });
    await queryInterface.renameColumn('Estimates', 'discount_value', 'discount');
  }
};

