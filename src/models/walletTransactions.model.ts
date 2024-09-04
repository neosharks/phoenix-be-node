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
import Payment from "./payment.model";

class WalletTransactions extends Model<
  InferAttributes<WalletTransactions>,
  InferCreationAttributes<WalletTransactions>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare source: "REFERRAL" | "PURCHASE";
  declare amount: number;
  declare paymentId: ForeignKey<Payment["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

WalletTransactions.init(
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
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
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

// Associations
// WalletTransactions.belongsTo(User, { foreignKey: "userId" });
// WalletTransactions.belongsTo(Payment, { foreignKey: "paymentId" });

export default WalletTransactions;
