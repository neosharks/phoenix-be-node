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

enum CONVERSATION_TYPE {
  ONE_TO_ONE = "ONE_TO_ONE",
  GROUP = "GROUP",
}
class Chat extends Model<InferAttributes<Chat>, InferCreationAttributes<Chat>> {
  declare id: CreationOptional<number>;
  declare participantOneId: ForeignKey<User["id"]>;
  declare participantTwoId: ForeignKey<User["id"]>;
  declare type: CONVERSATION_TYPE;
  declare unreadCount: CreationOptional<number>;
  declare pendingAllowed: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  static associate: (models: any) => void;
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
      references: {
        model: User,
        key: "id",
      },
    },
    participantTwoId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(CONVERSATION_TYPE),
      defaultValue: CONVERSATION_TYPE.ONE_TO_ONE,
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

// Associate
Chat.associate = (models: any) => {
  Chat.belongsTo(models.User, { as: "participantOne", foreignKey: "participantOneId" });
  Chat.belongsTo(models.User, { as: "participantTwo", foreignKey: "participantTwoId" });
  Chat.hasMany(models.Message, { foreignKey: "chatId" });
};

export default Chat;
