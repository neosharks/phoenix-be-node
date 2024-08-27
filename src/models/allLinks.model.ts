import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";

const AllLinks = sequelize.define(
  "AllLinks",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform: DataTypes.STRING,
    highlight: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: "AllLinks",
  },
);
// complete associate
AllLinks.belongsTo(User, { foreignKey: "userId" });
User.hasMany(AllLinks, { foreignKey: "userId" });

export default AllLinks;
