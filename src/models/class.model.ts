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

class Class extends Model<InferAttributes<Class>, InferCreationAttributes<Class>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare name: string;
  declare isPaid: boolean;
  declare creatorId: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  static associate: (models: any) => void;
}

Class.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    creatorId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
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
    modelName: "Class",
  },
);

// Associate
Class.associate = (models: any) => {
  Class.belongsTo(models.User, { as: "creator", foreignKey: "creatorId" });
  Class.hasMany(models.ClassParticipants, { foreignKey: "classId" });
  Class.hasMany(models.ClassMessage, { foreignKey: "classId" });
  Class.hasMany(models.UserPost, { foreignKey: "classId" });
};

export default Class;
