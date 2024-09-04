import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";
import Package from "./package.model";
import WalletTransactions from "./walletTransactions.model";
import Referral from "./referral.model";

export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
  declare id: CreationOptional<number>;
  declare orderId: string;
  declare userId: CreationOptional<ForeignKey<User["id"]>>;
  declare amount: CreationOptional<number>;
  declare currency: "INR";
  declare status: "CREATED" | "PAID" | "FAILED" | "PENDING";
  declare packageId: CreationOptional<ForeignKey<Package["id"]>>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// Initialize the model
Payment.init(
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
        model: Package,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
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

// Associations
Payment.belongsTo(User, { foreignKey: "userId" });
// Payment.belongsTo(Package, { foreignKey: "packageId" });
// Referral.belongsTo(Payment, { foreignKey: "paymentId" });
// WalletTransactions.belongsTo(Payment, { foreignKey: "paymentId" });
// Payment.hasMany(WalletTransactions, { foreignKey: "paymentId" });
// Payment.hasMany(Referral, { foreignKey: "paymentId" });

export default Payment;
