"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const ClickStream = sequelize_2.sequelize.define("ClickStream", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "User",
            key: "id",
        },
    },
    info: sequelize_1.DataTypes.JSON,
    type: sequelize_1.DataTypes.STRING,
    url: sequelize_1.DataTypes.STRING,
    ipAddress: sequelize_1.DataTypes.STRING,
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
    modelName: "ClickStream",
});
// Associations complete
exports.default = ClickStream;
