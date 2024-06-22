import express from "express";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { InsightController } from "../controllers/insight.controller";

const insightRoutes = express.Router();

insightRoutes.get("/get", checkRoleAuth(), InsightController.get);

export default insightRoutes;
