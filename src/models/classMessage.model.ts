import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./sequelize";
import Class from "./class.model";
import User from "./user.model";

class ClassMessage extends Model<
  InferAttributes<ClassMessage>,
  InferCreationAttributes<ClassMessage>
> {
  declare id: CreationOptional<number>;
  declare classId: ForeignKey<Class["id"]>;
  declare userId: ForeignKey<User["id"]>;
  declare message?: string;
  declare image?: string;
  declare video?: string;
  declare document?: string;
  declare repliedMessageId?: ForeignKey<ClassMessage["id"]>;
  declare isPinned: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  static associate: (models: any) => void;
}

ClassMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      references: {
        model: Class,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    repliedMessageId: {
      type: DataTypes.INTEGER,
      references: {
        model: ClassMessage,
        key: "id",
      },
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: "ClassMessage",
  },
);

// Associations
ClassMessage.associate = (models: any) => {
  ClassMessage.belongsTo(models.Class, { foreignKey: "classId" });
  ClassMessage.belongsTo(models.User, { foreignKey: "userId" });
  ClassMessage.belongsTo(models.ClassMessage, {
    as: "repliedMessage",
    foreignKey: "repliedMessageId",
  });
  ClassMessage.hasMany(models.ClassMessage, { as: "replies", foreignKey: "repliedMessageId" });
};

export default ClassMessage;
