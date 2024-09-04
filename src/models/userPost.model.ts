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
import PostComment from "./postComment.model";
import Class from "./class.model";
import Poll from "./poll.model";

class UserPost extends Model<InferAttributes<UserPost>, InferCreationAttributes<UserPost>> {
  declare id: CreationOptional<number>;
  declare authorId: ForeignKey<User["id"]>;
  declare type: "TEXT" | "IMAGE" | "POLL" | "LINK" | "VIDEO" | "CLASS" | "DOCUMENT";
  declare image: CreationOptional<string>;
  declare title: CreationOptional<string>;
  declare description: CreationOptional<string>;
  declare videoUrl: CreationOptional<string>;
  declare document: CreationOptional<string>;
  declare visibility: "EVERYONE" | "FREE_MEMBER" | "PAID_MEMBER";
  declare allowComments: CreationOptional<boolean>;
  declare pollId: CreationOptional<ForeignKey<Poll["id"]>>;
  declare classId: CreationOptional<ForeignKey<Class["id"]>>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

UserPost.init(
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
        model: Poll,
        key: "id",
      },
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Class,
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

// Associations
// UserPost.belongsTo(Class, { foreignKey: "classId" });
// UserPost.hasMany(PostComment, { foreignKey: "userPostId" });

export default UserPost;
