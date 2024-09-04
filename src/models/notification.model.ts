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

class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  declare id: CreationOptional<number>;
  declare aboutUserId: CreationOptional<ForeignKey<User["id"]>>;
  declare notifiedUserId: ForeignKey<User["id"]>;
  declare message: string;
  declare read: boolean;
  declare link: CreationOptional<string>;
  declare type:
    | "NEW_POST"
    | "MESSAGE"
    | "POLL"
    | "MENTIONED"
    | "NEW_COMMENT"
    | "NEW_LIKE"
    | "CLASS";
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    aboutUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    notifiedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(
        "NEW_POST",
        "MESSAGE",
        "POLL",
        "MENTIONED",
        "NEW_COMMENT",
        "NEW_LIKE",
        "CLASS",
      ),
      allowNull: false,
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
    modelName: "Notification",
    indexes: [
      {
        fields: ["aboutUserId", "notifiedUserId"],
      },
    ],
  },
);

// Associations
// Notification.belongsTo(User, { as: "aboutUser", foreignKey: "aboutUserId" });
// Notification.belongsTo(User, { as: "notifiedUser", foreignKey: "notifiedUserId" });

export default Notification;
