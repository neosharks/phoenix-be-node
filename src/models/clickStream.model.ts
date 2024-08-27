import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";

const ClickStream = sequelize.define(
  "ClickStream",
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
    info: DataTypes.JSON,
    type: DataTypes.STRING,
    url: DataTypes.STRING,
    ipAddress: DataTypes.STRING,
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
    modelName: "ClickStream",
  },
);

// Associations complete

export default ClickStream;
