"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Package = require("./package.models");
const sequelize_1 = require("sequelize");
const initializeTierModel = (sequelize) => {
    const Tier = sequelize.define("Tier", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tierType: {
            type: sequelize_1.DataTypes.ENUM("GENERAL_SUPPORT", "EXCLUSIVE_POSTS" /* add other options here */),
            defaultValue: "GENERAL_SUPPORT",
        },
        name: sequelize_1.DataTypes.STRING,
        description: sequelize_1.DataTypes.STRING,
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    });
    Tier.hasMany(Package);
    Package.belongsTo(Tier);
    return Tier;
};
exports.default = initializeTierModel;
