import express from "express";
import { UserController } from "../controllers/user.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";

const userRoutes = express.Router();

userRoutes.get("/get", checkRoleAuth(), UserController.getUser);

userRoutes.post("/creatorOnboard", checkRoleAuth(), UserController.creatorOnboard);

export default userRoutes;
