"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const user_model_1 = __importDefault(require("./user.model"));
const walletTransactions_model_1 = __importDefault(require("./walletTransactions.model"));
const referral_model_1 = __importDefault(require("./referral.model"));
const Payment = sequelize_2.sequelize.define("Payment", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    orderId: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    currency: {
        type: sequelize_1.DataTypes.ENUM("INR"),
        defaultValue: "INR",
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("CREATED", "PAID", "FAILED", "PENDING"),
        defaultValue: "CREATED",
    },
    packageId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "Package",
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
    modelName: "Payment",
});
// Associations complete
Payment.belongsTo(user_model_1.default, { foreignKey: "userId" });
referral_model_1.default.belongsTo(Payment, { foreignKey: "paymentId" });
walletTransactions_model_1.default.belongsTo(Payment, { foreignKey: "paymentId" });
Payment.hasMany(walletTransactions_model_1.default, { foreignKey: "paymentId" });
Payment.hasMany(referral_model_1.default, { foreignKey: "paymentId" });
exports.default = Payment;
