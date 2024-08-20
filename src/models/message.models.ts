const Chat = require("./chat.models");
// const User = require("./user.models");
import { Sequelize, DataTypes } from "sequelize";
const initializeMessageModel = (sequelize: Sequelize) => {
  const Message = sequelize.define("Message", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: DataTypes.STRING,
    contentType: {
      type: DataTypes.ENUM("TEXT", "IMAGE", "AUDIO"),
      defaultValue: "TEXT",
    },
    senderId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    chatId: {
      type: DataTypes.INTEGER,
      references: {
        model: Chat,
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
  });

  // Message.belongsTo(User, { foreignKey: "senderId" });
  Message.belongsTo(Chat, { foreignKey: "chatId" });

  return Message;
};

export default initializeMessageModel;
