module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Invoices', 'product_id');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Invoices', 'product_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Products', key: 'id' }
    });
  }
};

