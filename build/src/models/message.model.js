"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const Message = sequelize_2.sequelize.define("Message", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    message: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    senderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        },
    },
    contentType: {
        type: sequelize_1.DataTypes.ENUM("TEXT", "IMAGE", "AUDIO"),
        defaultValue: "TEXT",
    },
    chatId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Chat",
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
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "Message",
    indexes: [
        {
            fields: ["chatId"],
        },
    ],
});
// Associations completed
exports.default = Message;
