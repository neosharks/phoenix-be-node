import express from "express";
import { UserController } from "../controllers/user.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";

const userRoutes = express.Router();

userRoutes.get("/get", checkRoleAuth(), UserController.getUser);

userRoutes.get("/getByUsername/:username", UserController.getUserByUsername);

userRoutes.get("/getAllCreators", checkRoleAuth(), UserController.getAllCreator);

userRoutes.post("/creatorOnboard", checkRoleAuth(), UserController.creatorOnboard);

userRoutes.post("/update", checkRoleAuth(), UserController.update);

export default userRoutes;
