"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const user_model_1 = __importDefault(require("./user.model"));
const AllLinks = sequelize_2.sequelize.define("AllLinks", {
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
    url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    platform: sequelize_1.DataTypes.STRING,
    highlight: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
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
    modelName: "AllLinks",
});
// complete associate
AllLinks.belongsTo(user_model_1.default, { foreignKey: "userId" });
user_model_1.default.hasMany(AllLinks, { foreignKey: "userId" });
exports.default = AllLinks;
