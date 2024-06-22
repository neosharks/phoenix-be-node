import express from "express";
import { ChatController } from "../controllers/chat.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { userRole } from "../constant/role.constant";
import { ClassController } from "../controllers/class.controller";

const classRoutes = express.Router();

classRoutes.get("/getAllClasses", checkRoleAuth(), ClassController.getAllClasses);

classRoutes.get("/getOneClass", checkRoleAuth(), ClassController.getOneClass);

classRoutes.post("/create", checkRoleAuth([userRole.CREATOR]), ClassController.createClass);

classRoutes.post(
  "/addOneParticipant",
  checkRoleAuth([userRole.CREATOR]),
  ClassController.addOneParticipant,
);

classRoutes.get(
  "/getAllParticipantOfClass",
  checkRoleAuth(),
  ClassController.getAllParticipantOfClass,
);

classRoutes.post("/sendMessage", checkRoleAuth(), ClassController.sendMessage);

classRoutes.get("/getAllMessagesOfClass", checkRoleAuth(), ClassController.getAllMessagesOfClass);

export default classRoutes;
