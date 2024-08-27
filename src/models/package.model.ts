import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";
import PatronCreator from "./patronCreator.model";
import UserPost from "./userPost.model";
import Payment from "./payment.model";
import Tier from "./tier.model";

const Package = sequelize.define(
  "Package",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM("SUPPORT", "BRONZE", "SILVER", "GOLD", "PLATINUM", "RUBY"),
      defaultValue: "SUPPORT",
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    userPostId: {
      type: DataTypes.INTEGER,
      references: {
        model: "UserPost",
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
    modelName: "Package",
  },
);

// Associations complete
Package.belongsTo(User, { as: "creator", foreignKey: "creatorId" });
Package.belongsTo(UserPost, { foreignKey: "userPostId" });
User.hasMany(Package, { foreignKey: "userId" });
UserPost.hasMany(Package, { foreignKey: "userId" });

Package.hasMany(PatronCreator, { foreignKey: "packageId" });
Package.hasMany(Payment, { foreignKey: "packageId" });
Package.hasMany(Tier, { foreignKey: "packageId" });

PatronCreator.belongsTo(Package, { foreignKey: "packageId" });
Package.hasMany(PatronCreator, { foreignKey: "packageId" });

Payment.belongsTo(Package, { foreignKey: "packageId" });
Package.hasMany(Payment, { foreignKey: "packageId" });
UserPost.belongsToMany(Package, { through: "UserPostPackages", as: "packages" });

export default Package;
