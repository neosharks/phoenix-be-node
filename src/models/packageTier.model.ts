import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./sequelize";
import Tier from "./tier.model";
import Package from "./package.model";

class PackageTier extends Model<
  InferAttributes<PackageTier>,
  InferCreationAttributes<PackageTier>
> {
  declare id: CreationOptional<number>;
  declare packageId: ForeignKey<Package["id"]>;
  declare tierId: ForeignKey<Tier["id"]>;
}

PackageTier.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Package,
        key: "id",
      },
    },
    tierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tier,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "PackageTier",
  },
);
