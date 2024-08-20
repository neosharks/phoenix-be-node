import express from "express";
import { UserController } from "../controllers/user.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { uploadFileMiddleware } from "../core/s3upload.core";
import { userRole } from "../constant/role.constant";

const userRoutes = express.Router();

userRoutes.get("/get", checkRoleAuth(), UserController.getUser);

userRoutes.get("/getAllLinks/:username", UserController.getAllLinks);

userRoutes.post("/createLink", checkRoleAuth([userRole.CREATOR]), UserController.createLink);

userRoutes.get("/getByUsername/:username", UserController.getUserByUsername);

userRoutes.get("/getAllCreators", checkRoleAuth(), UserController.getAllCreator);

userRoutes.post("/creatorOnboard", checkRoleAuth(), UserController.creatorOnboard);

userRoutes.post("/approveCreatorOnboard", UserController.approveCreatorOnboard);

userRoutes.post("/update", checkRoleAuth(), UserController.update);

userRoutes.post("/updateCoverImage", checkRoleAuth(), UserController.updateCoverImage);

userRoutes.post("/updateProfileImage", checkRoleAuth(), UserController.updateProfileImage);

userRoutes.post("/joinForFree", checkRoleAuth(), UserController.joinForFree);

userRoutes.delete("/delete", UserController.delete);
userRoutes.get("/allUser", UserController.getAllTotalUser);
userRoutes.post("/createUser", UserController.createUser);

export default userRoutes;
