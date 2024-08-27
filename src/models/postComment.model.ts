import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

const PostComment = sequelize.define(
  "PostComment",
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userPostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: "PostComment",
  },
);

// Associations completed

export default PostComment;
