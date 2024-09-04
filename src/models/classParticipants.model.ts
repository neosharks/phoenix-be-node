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

class ClassParticipants extends Model<
  InferAttributes<ClassParticipants>,
  InferCreationAttributes<ClassParticipants>
> {
  declare id: CreationOptional<number>;
  declare classId: ForeignKey<Class["id"]>;
  declare userId: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  static associate: (models: any) => void;
}

ClassParticipants.init(
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
    modelName: "ClassParticipants",
  },
);

// Associations
ClassParticipants.associate = (models: any) => {
  ClassParticipants.belongsTo(models.Class, { foreignKey: "classId" });
  ClassParticipants.belongsTo(models.User, { foreignKey: "userId" });
};

export default ClassParticipants;
