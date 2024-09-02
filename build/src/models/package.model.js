"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const user_model_1 = __importDefault(require("./user.model"));
const patronCreator_model_1 = __importDefault(require("./patronCreator.model"));
const userPost_model_1 = __importDefault(require("./userPost.model"));
const payment_model_1 = __importDefault(require("./payment.model"));
const tier_model_1 = __importDefault(require("./tier.model"));
const Package = sequelize_2.sequelize.define("Package", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.ENUM("SUPPORT", "BRONZE", "SILVER", "GOLD", "PLATINUM", "RUBY"),
        defaultValue: "SUPPORT",
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    creatorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        },
    },
    userPostId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "UserPost",
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
    modelName: "Package",
});
// Associations complete
Package.belongsTo(user_model_1.default, { as: "creator", foreignKey: "creatorId" });
Package.belongsTo(userPost_model_1.default, { foreignKey: "userPostId" });
user_model_1.default.hasMany(Package, { foreignKey: "creatorId" });
userPost_model_1.default.hasMany(Package, { foreignKey: "userPostId" });
Package.hasMany(patronCreator_model_1.default, { foreignKey: "packageId" });
Package.hasMany(payment_model_1.default, { foreignKey: "packageId" });
Package.hasMany(tier_model_1.default, { foreignKey: "packageId" });
patronCreator_model_1.default.belongsTo(Package, { foreignKey: "packageId" });
payment_model_1.default.belongsTo(Package, { foreignKey: "packageId" });
tier_model_1.default.belongsTo(Package, { foreignKey: "packageId" });
exports.default = Package;
