import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";
import UserPost from "./userPost.model";

const Poll = sequelize.define(
  "Poll",
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
        model: "User",
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
Poll.hasMany(UserPost, { foreignKey: "pollId" });

export default Poll;
