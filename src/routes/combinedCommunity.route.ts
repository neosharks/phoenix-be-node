import express from "express";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { CombinedCommunityController } from "../controllers/combinedCommunity.controller";
import { userRole } from "../constant/role.constant";

const combinedCommunityRoutes = express.Router();

// -----------  GET ----------------

combinedCommunityRoutes.get("/getOne", checkRoleAuth(), CombinedCommunityController.getOne);

combinedCommunityRoutes.get("/getAll", checkRoleAuth(), CombinedCommunityController.getAll);

combinedCommunityRoutes.get(
  "/getAllByCreatorCommunity",
  checkRoleAuth([userRole.CREATOR]),
  CombinedCommunityController.getAllByCreatorCommunity,
);

// -----------  POST ----------------

combinedCommunityRoutes.post(
  "/create",
  checkRoleAuth([userRole.CREATOR]),
  CombinedCommunityController.create,
);

export default combinedCommunityRoutes;
