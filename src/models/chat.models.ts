import { Sequelize, DataTypes } from "sequelize";
const Message = require("./message.models");
// const User = require("./user.models");
const initializeChatModel = (sequelize: Sequelize) => {
  const Chat = sequelize.define("Chat", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    participantOneId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    participantTwoId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("ONE_TO_ONE"),
      defaultValue: "ONE_TO_ONE",
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

  Chat.hasMany(Message);
  Message.belongsTo(Chat);

  return Chat;
};

export default initializeChatModel;
