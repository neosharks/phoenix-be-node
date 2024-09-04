import { Sequelize, DataTypes, ModelStatic, Model } from "sequelize";
import fs from "fs";
import path from "path";
import config from "../../config";

const sequelize = new Sequelize(config.database.dbURI as string, {
  dialect: "postgres",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

interface DbInterface {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  [key: string]: ModelStatic<Model> | Sequelize | typeof Sequelize;
}

const db: DbInterface = {
  Sequelize,
  sequelize,
};

const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts";
  })
  .forEach((file) => {
    const modelModule = require(path.join(__dirname, file));
    const model =
      typeof modelModule === "function" ? modelModule(sequelize, DataTypes) : modelModule;
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName] && (db[modelName] as any).associate) {
    (db[modelName] as any).associate(db);
  }
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Tables created successfully");
  })
  .catch((error) => {
    console.error("Error creating tables:", error);
  });

export { sequelize, db };
