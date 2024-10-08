import express from "express";
import { UserController } from "../controllers/user.controller";
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { uploadFileMiddleware } from "../core/s3upload.core";
import { userRole } from "../constant/role.constant";

const userRoutes = express.Router();

// -----------  GET ----------------

userRoutes.get("/get", checkRoleAuth(), UserController.getUser);

userRoutes.get("/getAllLinks/:username", UserController.getAllLinks);

userRoutes.get("/getByUsername/:username", UserController.getUserByUsername);

userRoutes.get("/getAllCreators", checkRoleAuth(), UserController.getAllCreator);

userRoutes.get("/allUser", UserController.getAllTotalUser);

// -----------  POST ----------------

userRoutes.post("/createLink", checkRoleAuth([userRole.CREATOR]), UserController.createLink);

userRoutes.post("/creatorOnboard", checkRoleAuth(), UserController.creatorOnboard);

userRoutes.post("/approveCreatorOnboard", UserController.approveCreatorOnboard);

userRoutes.post("/update", checkRoleAuth(), UserController.update);

userRoutes.post("/updateCoverImage", checkRoleAuth(), UserController.updateCoverImage);

userRoutes.post("/updateProfileImage", checkRoleAuth(), UserController.updateProfileImage);

userRoutes.post("/joinForFree", checkRoleAuth(), UserController.joinForFree);

userRoutes.delete("/delete", UserController.delete);

userRoutes.get("/allUser", UserController.getAllTotalUser);

userRoutes.delete("/deleteAccount/:id", checkRoleAuth(), UserController.deleteAccount);

export default userRoutes;
