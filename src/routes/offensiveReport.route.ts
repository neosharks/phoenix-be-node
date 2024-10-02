import express from "express";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { CommonController } from "../controllers/common.controller";

const commonRoutes = express.Router();

// -----------  GET ----------------

commonRoutes.get("/getS3SignedUrl", checkRoleAuth(), CommonController.getS3SignedUrl);

// -----------  POST ----------------

commonRoutes.post("/clickStream", CommonController.clickStream);

export default commonRoutes;
