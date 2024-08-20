// const User = require("./user.models");
const Payment = require("./payment.models");
import { Sequelize, DataTypes } from "sequelize";
const initializeReferralModel = (sequelize: Sequelize) => {
  const Referral = sequelize.define("Referral", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    amount: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Payment,
        key: "id",
      },
    },
  });
  return Referral;
};

export default initializeReferralModel;
