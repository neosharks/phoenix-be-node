"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const User = require("./user.models");
const sequelize_1 = require("sequelize");
const initializePaymentModel = (sequelize) => {
    const Payment = sequelize.define("Payment", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        amount: sequelize_1.DataTypes.INTEGER,
        paymentMethod: {
            type: sequelize_1.DataTypes.ENUM("CARD", "BANK_TRANSFER", "PAYPAL"),
            defaultValue: "CARD",
        },
        paymentStatus: {
            type: sequelize_1.DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
            defaultValue: "PENDING",
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
    });
    // Payment.belongsTo(User);
    return Payment;
};
exports.default = initializePaymentModel;
