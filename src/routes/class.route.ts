import express from "express";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { userRole } from "../constant/role.constant";
import { ClassController } from "../controllers/class.controller";

const classRoutes = express.Router();

classRoutes.get("/getAllClasses", checkRoleAuth(), ClassController.getAllClasses);

classRoutes.get("/getOneClass", checkRoleAuth(), ClassController.getOneClass);

classRoutes.get(
  "/getAllParticipantOfClass",
  checkRoleAuth(),
  ClassController.getAllParticipantOfClass,
);

classRoutes.get("/getAllMessagesOfClass", checkRoleAuth(), ClassController.getAllMessagesOfClass);

classRoutes.get(
  "/getAvailableParticipants",
  checkRoleAuth(),
  ClassController.getAvailableParticipants,
);

classRoutes.get("/getAllClassesForUser", checkRoleAuth(), ClassController.getAllClassesForUser);

// -----------  POST ----------------

classRoutes.post("/updateClass", checkRoleAuth(), ClassController.updateClass);

classRoutes.post("/create", checkRoleAuth([userRole.CREATOR]), ClassController.createClass);

classRoutes.post("/addOneParticipant", checkRoleAuth(), ClassController.addOneParticipant);

classRoutes.post(
  "/addMultipleParticipants",
  checkRoleAuth([userRole.CREATOR]),
  ClassController.addMultipleParticipants,
);

classRoutes.post("/sendMessage", checkRoleAuth(), ClassController.sendMessage);

classRoutes.post("/deleteOneMessage", checkRoleAuth(), ClassController.deleteOneMessage);

classRoutes.post("/updateMessage", checkRoleAuth(), ClassController.updateMessage);

classRoutes.post("/leaveOneClass", checkRoleAuth(), ClassController.leaveOneClass);

classRoutes.post("/requestClass", checkRoleAuth(), ClassController.requestNewClass);

classRoutes.post(
  "/deactivateOneClass",
  checkRoleAuth([userRole.CREATOR]),
  ClassController.deactivateOneClass,
);

export default classRoutes;
