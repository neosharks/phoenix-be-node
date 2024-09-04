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

class Referral extends Model<InferAttributes<Referral>, InferCreationAttributes<Referral>> {
  declare id: CreationOptional<number>;
  declare creatorId: ForeignKey<User["id"]>;
  declare userId: ForeignKey<User["id"]>;
  declare amount: CreationOptional<number>;
  declare paymentId: CreationOptional<ForeignKey<Payment["id"]>>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  static associate: (models: any) => void;
}

Referral.init(
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
        model: User,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Payment,
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
Referral.associate = (models: any) => {
  Referral.belongsTo(models.User, { as: "creator", foreignKey: "creatorId" });
  Referral.belongsTo(models.User, { as: "user", foreignKey: "userId" });
  Referral.belongsTo(models.Payment, { foreignKey: "paymentId" });
};

export default Referral;
