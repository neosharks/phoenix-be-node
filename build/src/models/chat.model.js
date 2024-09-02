"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const Chat = sequelize_2.sequelize.define("Chat", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    participantOneId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        },
    },
    participantTwoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        },
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("ONE_TO_ONE"),
        defaultValue: "ONE_TO_ONE",
    },
    unreadCount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    pendingAllowed: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1,
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
    modelName: "Chat",
});
// Associations complete
exports.default = Chat;
