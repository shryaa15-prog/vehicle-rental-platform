'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Customer, {
        foreignKey: 'customerId',
        as: 'customer'
      });
      Booking.belongsTo(models.Car, {
        foreignKey: 'carId',
        as: 'car'
      });
    }
  }
  Booking.init({
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    carId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalAmount: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'confirmed',
      validate: {
        isIn: [['confirmed', 'cancelled', 'completed']]
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
    validate: {
      endAfterStart() {
        if (this.endDate <= this.startDate) {
          throw new Error('endDate must be after startDate');
        }
      }
    }
  });
  return Booking;
};