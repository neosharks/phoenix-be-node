import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";
import Payment from "./payment.model";

const Referral = sequelize.define(
  "Referral",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
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
    modelName: "Referral",
  },
);

// Associations
// Referral.belongsTo(User, { as: "creator", foreignKey: "creatorId" });
// Referral.belongsTo(User, { as: "user", foreignKey: "userId" });
// Referral.belongsTo(Payment, { foreignKey: "paymentId" });

export default Referral;
