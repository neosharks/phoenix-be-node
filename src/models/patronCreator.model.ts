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

class PatronCreator extends Model<
  InferAttributes<PatronCreator>,
  InferCreationAttributes<PatronCreator>
> {
  declare id: CreationOptional<number>;
  declare patronId: ForeignKey<User["id"]>;
  declare creatorId: ForeignKey<User["id"]>;
  declare packageId: CreationOptional<ForeignKey<Package["id"]>>;
  declare type: "FREE" | "PAID";
  declare expiry: CreationOptional<Date>;
  declare status: "ACTIVE" | "EXPIRED" | "PENDING";
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  static associate: (models: any) => void;
}

PatronCreator.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patronId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Package,
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("FREE", "PAID"),
      defaultValue: "FREE",
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "EXPIRED", "PENDING"),
      defaultValue: "PENDING",
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
    modelName: "PatronCreator",
  },
);

// Associations
PatronCreator.associate = (models: any) => {
  PatronCreator.belongsTo(models.User, { as: "patron", foreignKey: "patronId" });
  PatronCreator.belongsTo(models.User, { as: "creator", foreignKey: "creatorId" });
  PatronCreator.belongsTo(models.Package, { foreignKey: "packageId" });
};

export default PatronCreator;
