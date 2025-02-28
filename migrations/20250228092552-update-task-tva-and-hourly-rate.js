'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Tasks', 'tva', {
      type: Sequelize.ENUM('12.3', '21.20', '21.10', '20.00', '10.00'),
      allowNull: false,
    });

    await queryInterface.addColumn('Tasks', 'hourly_rate', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tasks', 'hourly_rate');

    await queryInterface.changeColumn('Tasks', 'tva', {
      type: Sequelize.FLOAT
    });
  }
};
