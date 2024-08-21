import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    aboutUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
    },
    notifiedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(
        "NEW_POST",
        "MESSAGE",
        "POLL",
        "MENTIONED",
        "NEW_COMMENT",
        "NEW_LIKE",
        "CLASS",
      ),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Notification",
    indexes: [
      {
        fields: ["aboutUserId", "notifiedUserId"],
      },
    ],
  },
);

// Associations
// Notification.belongsTo(User, { as: "aboutUser", foreignKey: "aboutUserId" });
// Notification.belongsTo(User, { as: "notifiedUser", foreignKey: "notifiedUserId" });

export default Notification;
