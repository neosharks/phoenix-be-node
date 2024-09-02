"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const ClassParticipants = sequelize_2.sequelize.define("ClassParticipants", {
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
    modelName: "ClassParticipants",
});
// Associations complete
exports.default = ClassParticipants;
