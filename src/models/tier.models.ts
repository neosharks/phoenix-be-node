const Package = require("./package.models");
import { Sequelize, DataTypes } from "sequelize";
const initializeTierModel = (sequelize: Sequelize) => {
  const Tier = sequelize.define("Tier", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tierType: {
      type: DataTypes.ENUM("GENERAL_SUPPORT", "EXCLUSIVE_POSTS" /* add other options here */),
      defaultValue: "GENERAL_SUPPORT",
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Tier.hasMany(Package);
  Package.belongsTo(Tier);
  return Tier;
};

export default initializeTierModel;
