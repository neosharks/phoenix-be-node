"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const WalletTransactions = sequelize_2.sequelize.define("WalletTransactions", {
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
    source: {
        type: sequelize_1.DataTypes.ENUM("REFERRAL", "PURCHASE"),
    },
    amount: sequelize_1.DataTypes.INTEGER,
    paymentId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "Payment",
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
    modelName: "WalletTransactions",
});
// Associate completed
exports.default = WalletTransactions;
