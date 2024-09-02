"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/tier.model.js
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const Tier = sequelize_2.sequelize.define("Tier", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tierType: {
        type: sequelize_1.DataTypes.ENUM("GENERAL_SUPPORT", "EXCLUSIVE_POSTS", "BEHIND_THE_SCENES", "UNLIMITED_MESSAGE", "ONE_TIME_MESSAGE", "NAME_POST_DESCRIPTION", "NAME_POST_END", "EXCLUSIVE_POLLS", "MENTORSHIP", "COMMUNITY"),
        defaultValue: "GENERAL_SUPPORT",
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
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
    modelName: "Tier",
});
exports.default = Tier;
