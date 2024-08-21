import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";
import Message from "./message.model";

const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    participantOneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    participantTwoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("ONE_TO_ONE"),
      defaultValue: "ONE_TO_ONE",
    },
    unreadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pendingAllowed: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
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
    modelName: "Chat",
  },
);

// Associations
// Chat.belongsTo(User, { as: "participantOne", foreignKey: "participantOneId" });
// Chat.belongsTo(User, { as: "participantTwo", foreignKey: "participantTwoId" });
Chat.hasMany(Message, { foreignKey: "chatId", onDelete: "CASCADE" });

export default Chat;
