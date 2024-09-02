"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const user_model_1 = __importDefault(require("./user.model"));
const userPost_model_1 = __importDefault(require("./userPost.model"));
const Poll = sequelize_2.sequelize.define("Poll", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    authorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        },
    },
    options: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    selectedOptions: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
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
    modelName: "Poll",
});
// Associations complete
Poll.belongsTo(user_model_1.default, { as: "author", foreignKey: "authorId" });
userPost_model_1.default.belongsTo(Poll, { foreignKey: "pollId" });
user_model_1.default.hasMany(Poll, { as: "Polls", foreignKey: "authorId" });
Poll.hasMany(userPost_model_1.default, { foreignKey: "pollId" });
exports.default = Poll;
