const { Sequelize, DataTypes, Model } = require("sequelize");
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error: any) {
  console.error("Unable to connect to the database:", error);
}

const db: any = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model");
db.chat = require("./chat.model");
db.message = require("./message.model");
db.package = require("./package.model");
db.classMessage = require("./classMessage.model");
db.class = require("./class.model");
db.allLinks = require("./allLinks.model");
db.walletTransactions = require("./walletTransactions.model");
db.clickStream = require("./clickStream.model");
db.payment = require("./payment.model");
db.poll = require("./poll.model");
db.postComment = require("./postComment.model");
db.userPost = require("./userPost.model");
db.patronCreator = require("./patronCreator.model");
db.notification = require("./notification.model");
db.classParticipants = require("./classParticipants.model");
db.referral = require("./referral.model");

db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Tables created successfully");
  })
  .catch((error: any) => {
    console.error("Error creating tables:", error);
  });

export { sequelize, db };
