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

class PostComment extends Model<
  InferAttributes<PostComment>,
  InferCreationAttributes<PostComment>
> {
  declare id: CreationOptional<number>;
  declare authorId: ForeignKey<User["id"]>;
  declare description: string;
  declare userPostId: ForeignKey<UserPost["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  static associate: (models: any) => void;
}

PostComment.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userPostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: "PostComment",
  },
);

// Associations completed
PostComment.associate = (models: any) => {
  PostComment.belongsTo(models.User, { foreignKey: "authorId" });
  PostComment.belongsTo(models.UserPost, { foreignKey: "userPostId" });
};

export default PostComment;
