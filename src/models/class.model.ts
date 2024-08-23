import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";
import ClassParticipants from "./classParticipants.model";
import ClassMessage from "./classMessage.model";
import UserPost from "./userPost.model";

const Class = sequelize.define(
  "Class",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentFrequency: {
      type: DataTypes.ENUM("ONE_TIME", "MONTHLY", "YEARLY"),
      allowNull: true,
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
    modelName: "Class",
  },
);

// Associations
// Class.belongsTo(User, { foreignKey: "creatorId" });
Class.hasMany(ClassParticipants, { foreignKey: "classId", as: "participants" });
Class.hasMany(ClassMessage, { foreignKey: "classId", as: "messages" });
Class.hasMany(UserPost, { foreignKey: "classId", as: "posts" });

export default Class;
