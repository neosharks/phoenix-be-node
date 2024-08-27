import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";

const WalletTransactions = sequelize.define(
  "WalletTransactions",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    source: {
      type: DataTypes.ENUM("REFERRAL", "PURCHASE"),
    },
    amount: DataTypes.INTEGER,
    paymentId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Payment",
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
  },
  {
    sequelize,
    modelName: "WalletTransactions",
  },
);

// Associate completed

export default WalletTransactions;
