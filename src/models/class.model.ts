import { DataTypes, Model } from "sequelize";
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
    type: DataTypes.STRING,
    price: DataTypes.INTEGER,
    paymentFrequency: {
      type: DataTypes.ENUM("ONE_TIME", "MONTHLY", "YEARLY"),
      defaultValue: "ONE_TIME",
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

// Class.belongsTo(User, { foreignKey: "creatorId" });
Class.hasMany(ClassParticipants, { foreignKey: "classId" });
Class.hasMany(ClassMessage, { foreignKey: "classId" });
Class.hasMany(UserPost, { foreignKey: "classId" });

export default Class;
