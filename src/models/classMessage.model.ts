import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";
import Class from "./class.model";
import User from "./user.model";

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

// ClassMessage.belongsTo(Class, { foreignKey: "classId" });
// ClassMessage.belongsTo(User, { foreignKey: "userId" });
// ClassMessage.belongsTo(ClassMessage, { as: "repliedMessage", foreignKey: "repliedMessageId" });
ClassMessage.hasMany(ClassMessage, { as: "replies", foreignKey: "repliedMessageId" });

export default ClassMessage;
