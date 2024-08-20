"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chat = require("./chat.models");
// const User = require("./user.models");
const sequelize_1 = require("sequelize");
const initializeMessageModel = (sequelize) => {
    const Message = sequelize.define("Message", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        message: sequelize_1.DataTypes.STRING,
        contentType: {
            type: sequelize_1.DataTypes.ENUM("TEXT", "IMAGE", "AUDIO"),
            defaultValue: "TEXT",
        },
        senderId: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: "User",
                key: "id",
            },
        },
        chatId: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: Chat,
                key: "id",
            },
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    });
    // Message.belongsTo(User, { foreignKey: "senderId" });
    Message.belongsTo(Chat, { foreignKey: "chatId" });
    return Message;
};
exports.default = initializeMessageModel;
