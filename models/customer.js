'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {

    }
  }
  Customer.init(
    {
      name: {
        type: DataTypes.STRING(100)
      },
      surname: {
        type: DataTypes.STRING(100)
      },
      adress: {
        type: DataTypes.STRING(255)
      },
      city: {
        type: DataTypes.STRING(100)
      },
      postal_code: {
        type: DataTypes.INTEGER
      },
      company: {
        type: DataTypes.STRING(100)
      },
      phone: {
        type: DataTypes.INTEGER
      },
      email: {
        type: DataTypes.STRING(255)
      }
    },
    {
      sequelize,
      modelName: 'Customer'
    }
  );
  return Customer;
};
