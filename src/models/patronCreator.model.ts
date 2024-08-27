import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

const PatronCreator = sequelize.define(
  "PatronCreator",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patronId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Package",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("FREE", "PAID"),
      defaultValue: "FREE",
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "EXPIRED", "PENDING"),
      defaultValue: "PENDING",
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
    modelName: "PatronCreator",
  },
);

// Associations completed

export default PatronCreator;
