"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const User = require("./user.models");
const Payment = require("./payment.models");
const sequelize_1 = require("sequelize");
const initializeReferralModel = (sequelize) => {
    const Referral = sequelize.define("Referral", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        creatorId: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: "User",
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
        amount: sequelize_1.DataTypes.INTEGER,
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        paymentId: {
            type: sequelize_1.DataTypes.INTEGER,
            references: {
                model: Payment,
                key: "id",
            },
        },
    });
    return Referral;
};
exports.default = initializeReferralModel;
