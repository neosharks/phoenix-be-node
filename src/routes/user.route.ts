import express from "express";
import { UserController } from "../controllers/user.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { uploadFileMiddleware } from "../core/s3upload.core";

const userRoutes = express.Router();

userRoutes.get("/get", checkRoleAuth(), UserController.getUser);

userRoutes.get("/getByUsername/:username", UserController.getUserByUsername);

userRoutes.get("/getAllCreators", checkRoleAuth(), UserController.getAllCreator);

userRoutes.post("/creatorOnboard", checkRoleAuth(), UserController.creatorOnboard);

userRoutes.post(
  "/update",
  checkRoleAuth(),
  uploadFileMiddleware.single("profileImage"),
  UserController.update,
);

userRoutes.delete("/delete", UserController.delete);

export default userRoutes;
