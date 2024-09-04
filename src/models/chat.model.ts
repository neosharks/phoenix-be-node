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
import Message from "./message.model";

class Chat extends Model<InferAttributes<Chat>, InferCreationAttributes<Chat>> {
  declare id: CreationOptional<number>;
  declare participantOneId: ForeignKey<User["id"]>;
  declare participantTwoId: ForeignKey<User["id"]>;
  declare type: "ONE_TO_ONE" | "GROUP";
  declare unreadCount: number;
  declare pendingAllowed: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    participantOneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    participantTwoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("ONE_TO_ONE", "GROUP"),
      defaultValue: "ONE_TO_ONE",
    },
    unreadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pendingAllowed: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
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
    modelName: "Chat",
  },
);

// Associations
Chat.belongsTo(User, { as: "participantOne", foreignKey: "participantOneId" });
Chat.belongsTo(User, { as: "participantTwo", foreignKey: "participantTwoId" });
Chat.hasMany(Message, { foreignKey: "chatId", onDelete: "CASCADE" });

export default Chat;
