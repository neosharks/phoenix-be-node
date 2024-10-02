import express from "express";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { OffensiveReportingController } from "../controllers/offensiveReporting.controller";

const offensiveReportRoute = express.Router();

// -----------  POST ----------------

offensiveReportRoute.post("/create", checkRoleAuth(), OffensiveReportingController.create);

export default offensiveReportRoute;
