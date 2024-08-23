import express from "express";
import { ChatController } from "../controllers/chat.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { userRole } from "../constant/role.constant";
import { ClassController } from "../controllers/class.controller";

const classRoutes = express.Router();

classRoutes.get("/getAllClasses", checkRoleAuth(), ClassController.getAllClasses);

classRoutes.get("/getOneClass", checkRoleAuth(), ClassController.getOneClass);
classRoutes.post("/updateClass", checkRoleAuth(), ClassController.updateClass);

classRoutes.post("/create", checkRoleAuth([userRole.CREATOR]), ClassController.createClass);

classRoutes.post(
  "/addOneParticipant",
  checkRoleAuth([userRole.CREATOR]),
  ClassController.addOneParticipant,
);

classRoutes.post(
  "/addMultipleParticipants",
  checkRoleAuth([userRole.CREATOR]),
  ClassController.addMultipleParticipants,
);

classRoutes.get(
  "/getAllParticipantOfClass",
  checkRoleAuth(),
  ClassController.getAllParticipantOfClass,
);

classRoutes.post("/updateSendMessage", checkRoleAuth(), ClassController.updateSendMessage);

classRoutes.get("/getAllMessagesOfClass", checkRoleAuth(), ClassController.getAllMessagesOfClass);

classRoutes.get(
  "/getAvailableParticipants",
  checkRoleAuth(),
  ClassController.getAvailableParticipants,
);

classRoutes.get("/getAllClassesForUser", checkRoleAuth(), ClassController.getAllClassesForUser);

classRoutes.post("/joinPaidClass", checkRoleAuth(), ClassController.joinPaidClass);

export default classRoutes;
