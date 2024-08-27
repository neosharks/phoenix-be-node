import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import PostComment from "./postComment.model";

const UserPost = sequelize.define(
  "UserPost",
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
    type: {
      type: DataTypes.ENUM("TEXT", "IMAGE", "POLL", "LINK", "VIDEO", "CLASS", "DOCUMENT"),
      defaultValue: "TEXT",
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
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visibility: {
      type: DataTypes.ENUM("EVERYONE", "FREE_MEMBER", "PAID_MEMBER"),
      defaultValue: "EVERYONE",
    },
    allowComments: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    pollId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Poll",
        key: "id",
      },
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Class",
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
    modelName: "UserPost",
    indexes: [
      {
        fields: ["visibility", "authorId"],
      },
    ],
  },
);

// Associations completed

UserPost.hasMany(PostComment, { foreignKey: "userPostId" });

export default UserPost;
