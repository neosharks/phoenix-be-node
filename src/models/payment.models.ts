// const User = require("./user.models");
import { Sequelize, DataTypes } from "sequelize";
const initializePaymentModel = (sequelize: Sequelize) => {
  const Payment = sequelize.define("Payment", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: DataTypes.INTEGER,
    paymentMethod: {
      type: DataTypes.ENUM("CARD", "BANK_TRANSFER", "PAYPAL"),
      defaultValue: "CARD",
    },
    paymentStatus: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
      defaultValue: "PENDING",
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Payment.belongsTo(User);
  return Payment;
};

export default initializePaymentModel;
