import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";
import Payment from "./payment.model";

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

// WalletTransactions.belongsTo(User, { foreignKey: "userId" });
// WalletTransactions.belongsTo(Payment, { foreignKey: "paymentId" });

export default WalletTransactions;
