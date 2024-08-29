import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";

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
        model: User,
        key: "id",
      },
    },
    name: DataTypes.STRING,
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

// Associations complete

export default Class;
