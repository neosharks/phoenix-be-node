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

class Poll extends Model<InferAttributes<Poll>, InferCreationAttributes<Poll>> {
  declare id: CreationOptional<number>;
  declare authorId: ForeignKey<User["id"]>;
  declare options: Record<string, any>;
  declare selectedOptions: Record<string, any>;
  declare image: CreationOptional<string>;
  declare title: CreationOptional<string>;
  declare description: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// Initialize the model
Poll.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    selectedOptions: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
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
    modelName: "Poll",
  },
);

// Associations
// Poll.belongsTo(User, { as: "author", foreignKey: "authorId" });
// UserPost.belongsTo(Poll, { foreignKey: "pollId" });
// User.hasMany(Poll, { as: "Polls", foreignKey: "authorId" });
// Poll.hasMany(UserPost, { foreignKey: "pollId" });

export default Poll;
