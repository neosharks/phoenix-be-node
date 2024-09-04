import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";
import UserPost from "./userPost.model";
import PatronCreator from "./patronCreator.model";
import Payment from "./payment.model";
import Tier from "./tier.model";

class Package extends Model<InferAttributes<Package>, InferCreationAttributes<Package>> {
  declare id: CreationOptional<number>;
  declare name: "SUPPORT" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "RUBY";
  declare price: number;
  declare description: string;
  declare creatorId: ForeignKey<User["id"]>;
  declare userPostId: CreationOptional<ForeignKey<UserPost["id"]>>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Package.init(
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
        model: User,
        key: "id",
      },
    },
    userPostId: {
      type: DataTypes.INTEGER,
      references: {
        model: UserPost,
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

// Associations
// Package.belongsTo(User, { as: "creator", foreignKey: "creatorId" });
// Package.belongsTo(UserPost, { foreignKey: "userPostId" });

// User.hasMany(Package, { foreignKey: "creatorId" });
// UserPost.hasMany(Package, { foreignKey: "userPostId" });

// Package.hasMany(PatronCreator, { foreignKey: "packageId" });
// Package.hasMany(Payment, { foreignKey: "packageId" });

Package.hasMany(Tier, { foreignKey: "packageId" });

// PatronCreator.belongsTo(Package, { foreignKey: "packageId" });
// Payment.belongsTo(Package, { foreignKey: "packageId" });
// Tier.belongsTo(Package, { foreignKey: "packageId" });

export default Package;
