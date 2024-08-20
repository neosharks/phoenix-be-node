"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Message = require("./message.models");
// const User = require("./user.models");
const initializeChatModel = (sequelize) => {
    const Chat = sequelize.define("Chat", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        participantOneId: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: "User",
                key: "id",
            },
        },
        participantTwoId: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: "User",
                key: "id",
            },
        },
        type: {
            type: sequelize_1.DataTypes.ENUM("ONE_TO_ONE"),
            defaultValue: "ONE_TO_ONE",
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
    Chat.hasMany(Message);
    Message.belongsTo(Chat);
    return Chat;
};
exports.default = initializeChatModel;
