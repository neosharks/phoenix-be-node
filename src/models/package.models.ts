// const User = require("./user.models");

import { Sequelize, DataTypes } from "sequelize";
const initializePackageModel = (sequelize: Sequelize) => {
  const Package = sequelize.define("Package", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM("SUPPORT", "BRONZE", "SILVER", "GOLD", "PLATINUM", "RUBY"),
      defaultValue: "SUPPORT",
    },
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    creatorId: {
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
  });

  // Package.belongsTo(User, { foreignKey: "creatorId" });
  // User.hasMany(Package);
  return Package;
};

export default initializePackageModel;
