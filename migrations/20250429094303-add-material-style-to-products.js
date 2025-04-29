'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'material', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('Products', 'style', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Products', 'style');
    await queryInterface.removeColumn('Products', 'material');
  },
};
