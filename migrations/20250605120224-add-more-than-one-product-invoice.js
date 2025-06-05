module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invoice_products', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Invoices', key: 'id' },
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('invoice_products');
  }
};
