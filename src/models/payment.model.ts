import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";
import WalletTransactions from "./walletTransactions.model";
import Referral from "./referral.model";

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING,
      unique: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.ENUM("INR"),
      defaultValue: "INR",
    },
    status: {
      type: DataTypes.ENUM("CREATED", "PAID", "FAILED", "PENDING"),
      defaultValue: "CREATED",
    },
    packageId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Package",
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
    modelName: "Payment",
  },
);

// Associations complete

Payment.belongsTo(User, { foreignKey: "userId" });
Referral.belongsTo(Payment, { foreignKey: "paymentId" });
WalletTransactions.belongsTo(Payment, { foreignKey: "paymentId" });
Payment.hasMany(WalletTransactions, { foreignKey: "paymentId" });
Payment.hasMany(Referral, { foreignKey: "paymentId" });

export default Payment;
