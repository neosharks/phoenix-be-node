"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const user_model_1 = __importDefault(require("./user.model"));
const Class = sequelize_2.sequelize.define("Class", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    creatorId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: user_model_1.default,
            key: "id",
        },
    },
    name: sequelize_1.DataTypes.STRING,
    isPaid: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    paymentFrequency: {
        type: sequelize_1.DataTypes.ENUM("ONE_TIME", "MONTHLY", "YEARLY"),
        allowNull: true,
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
    modelName: "Class",
});
// Associations complete
exports.default = Class;
