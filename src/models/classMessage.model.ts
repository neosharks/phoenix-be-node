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
    message: DataTypes.STRING,
    image: DataTypes.STRING,
    video: DataTypes.STRING,
    document: DataTypes.STRING,
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
