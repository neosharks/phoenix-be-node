"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const Notification = sequelize_2.sequelize.define("Notification", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    aboutUserId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "User",
            key: "id",
        },
    },
    notifiedUserId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        },
    },
    message: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    read: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    link: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("NEW_POST", "MESSAGE", "POLL", "MENTIONED", "NEW_COMMENT", "NEW_LIKE", "CLASS"),
        allowNull: false,
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
    modelName: "Notification",
    indexes: [
        {
            fields: ["aboutUserId", "notifiedUserId"],
        },
    ],
});
// Associations complete
exports.default = Notification;
