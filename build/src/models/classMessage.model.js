"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const ClassMessage = sequelize_2.sequelize.define("ClassMessage", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    classId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "Class",
            key: "id",
        },
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "User",
            key: "id",
        },
    },
    message: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    video: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    document: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    repliedMessageId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "ClassMessage",
            key: "id",
        },
    },
    isPinned: {
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
    modelName: "ClassMessage",
});
// Associations complete
exports.default = ClassMessage;
