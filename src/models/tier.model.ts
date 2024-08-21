// models/tier.model.js
import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";

const Tier = sequelize.define(
  "Tier",
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

export default Tier;
