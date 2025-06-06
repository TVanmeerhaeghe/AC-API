'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) { }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING(255),
      },
      description: {
        type: DataTypes.TEXT,
      },
      category_id: {
        type: DataTypes.INTEGER,
      },
      condition: {
        type: DataTypes.ENUM('Neuf', 'Presque Neuf', 'Bon', 'Passable'),
      },
      price: {
        type: DataTypes.FLOAT,
      },
      sell_state: {
        type: DataTypes.BOOLEAN,
      },
      images: {
        type: DataTypes.STRING(255),
      },
      video: {
        type: DataTypes.STRING(255),
      },
      buy_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      material: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      style: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );

  return Product;
};
