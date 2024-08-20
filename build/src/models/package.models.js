"use strict";
// const User = require("./user.models");
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const initializePackageModel = (sequelize) => {
    const Package = sequelize.define("Package", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.ENUM("SUPPORT", "BRONZE", "SILVER", "GOLD", "PLATINUM", "RUBY"),
            defaultValue: "SUPPORT",
        },
        price: sequelize_1.DataTypes.INTEGER,
        description: sequelize_1.DataTypes.STRING,
        creatorId: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: "User",
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
    // Package.belongsTo(User, { foreignKey: "creatorId" });
    // User.hasMany(Package);
    return Package;
};
exports.default = initializePackageModel;
