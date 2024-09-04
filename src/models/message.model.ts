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
import Chat from "./chat.model";

class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
  declare id: CreationOptional<number>;
  declare message: string;
  declare senderId: ForeignKey<User["id"]>;
  declare contentType: "TEXT" | "IMAGE" | "AUDIO";
  declare chatId: ForeignKey<Chat["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  static associate: (models: any) => void;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    contentType: {
      type: DataTypes.ENUM("TEXT", "IMAGE", "AUDIO"),
      defaultValue: "TEXT",
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Chat,
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
    modelName: "Message",
    indexes: [
      {
        fields: ["chatId"],
      },
    ],
  },
);

// Associations
Message.associate = (models: any) => {
  Message.belongsTo(models.Chat, { foreignKey: "chatId" });
  Message.belongsTo(models.User, { as: "sender", foreignKey: "senderId" });
};

export default Message;
