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

class ClickStream extends Model<
  InferAttributes<ClickStream>,
  InferCreationAttributes<ClickStream>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare info?: object; // `object` type for JSON
  declare type?: string;
  declare url?: string;
  declare ipAddress?: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ClickStream.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    info: {
      type: DataTypes.JSON,
      allowNull: true, // Set allowNull to true if the column can be null
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true, // Set allowNull to true if the column can be null
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true, // Set allowNull to true if the column can be null
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true, // Set allowNull to true if the column can be null
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
    modelName: "ClickStream",
  },
);

// Associations
// ClickStream.belongsTo(User, { foreignKey: "userId" });

export default ClickStream;
