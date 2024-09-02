"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const postComment_model_1 = __importDefault(require("./postComment.model"));
const class_model_1 = __importDefault(require("./class.model"));
const UserPost = sequelize_2.sequelize.define("UserPost", {
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
    type: {
        type: sequelize_1.DataTypes.ENUM("TEXT", "IMAGE", "POLL", "LINK", "VIDEO", "CLASS", "DOCUMENT"),
        defaultValue: "TEXT",
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
        allowNull: true,
    },
    videoUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    document: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    visibility: {
        type: sequelize_1.DataTypes.ENUM("EVERYONE", "FREE_MEMBER", "PAID_MEMBER"),
        defaultValue: "EVERYONE",
    },
    allowComments: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    pollId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "Poll",
            key: "id",
        },
    },
    classId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "Class",
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
    modelName: "UserPost",
    indexes: [
        {
            fields: ["visibility", "authorId"],
        },
    ],
});
// Associations completed
UserPost.belongsTo(class_model_1.default, { foreignKey: "classId" });
UserPost.hasMany(postComment_model_1.default, { foreignKey: "userPostId" });
exports.default = UserPost;
