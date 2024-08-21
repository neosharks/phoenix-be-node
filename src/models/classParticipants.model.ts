import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";
import Class from "./class.model";
import User from "./user.model";

const ClassParticipants = sequelize.define(
  "ClassParticipants",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Class",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
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
    modelName: "ClassParticipants",
  },
);

// ClassParticipants.belongsTo(Class, { foreignKey: "classId" });
// ClassParticipants.belongsTo(User, { foreignKey: "userId" });

export default ClassParticipants;
