import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import Chat from "./chat.model";
import User from "./user.model";

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    contentType: {
      type: DataTypes.ENUM("TEXT", "IMAGE", "AUDIO"),
      defaultValue: "TEXT",
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Chat",
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
    modelName: "Message",
    indexes: [
      {
        fields: ["chatId"],
      },
    ],
  },
);

// Associations
// Message.belongsTo(Chat, { foreignKey: "chatId" });
// Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });

export default Message;
