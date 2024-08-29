import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";

const ClassMessage = sequelize.define(
  "ClassMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Class",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    repliedMessageId: {
      type: DataTypes.INTEGER,
      references: {
        model: "ClassMessage",
        key: "id",
      },
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: "ClassMessage",
  },
);

// Associations complete

export default ClassMessage;
