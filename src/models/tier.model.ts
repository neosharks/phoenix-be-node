import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./sequelize";
import Package from "./package.model";

class Tier extends Model<InferAttributes<Tier>, InferCreationAttributes<Tier>> {
  declare id: CreationOptional<number>;
  declare tierType: CreationOptional<
    | "GENERAL_SUPPORT"
    | "EXCLUSIVE_POSTS"
    | "BEHIND_THE_SCENES"
    | "UNLIMITED_MESSAGE"
    | "ONE_TIME_MESSAGE"
    | "NAME_POST_DESCRIPTION"
    | "NAME_POST_END"
    | "EXCLUSIVE_POLLS"
    | "MENTORSHIP"
    | "COMMUNITY"
  >;
  declare name: string;
  declare description: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  static associate: (models: any) => void;
}

Tier.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tierType: {
      type: DataTypes.ENUM(
        "GENERAL_SUPPORT",
        "EXCLUSIVE_POSTS",
        "BEHIND_THE_SCENES",
        "UNLIMITED_MESSAGE",
        "ONE_TIME_MESSAGE",
        "NAME_POST_DESCRIPTION",
        "NAME_POST_END",
        "EXCLUSIVE_POLLS",
        "MENTORSHIP",
        "COMMUNITY",
      ),
      defaultValue: "GENERAL_SUPPORT",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "Tier",
  },
);

//Associate
Tier.associate = (models: any) => {
  Tier.hasMany(models.Package, { foreignKey: "tierId" });
};

export default Tier;
