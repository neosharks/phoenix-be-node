import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import User from "./user.model";
import UserPost from "./userPost.model";

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

// Associations
// PostComment.belongsTo(User, { as: "author", foreignKey: "authorId" });
// PostComment.belongsTo(UserPost, { foreignKey: "userPostId" });

export default PostComment;
