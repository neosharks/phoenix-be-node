import express from "express";
//------------------------
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { userRole } from "../constant/role.constant";
import { UserPostController } from "../controllers/userPost.controller";
import { uploadFileMiddleware } from "../core/s3upload.core";

const userPostRoutes = express.Router();

userPostRoutes.post(
  "/createUserPost",
  checkRoleAuth([userRole.CREATOR]),
  uploadFileMiddleware.single("image"),
  UserPostController.createOneUserPost,
);

userPostRoutes.post(
  "/commentOnPostByUser",
  checkRoleAuth(),
  UserPostController.commentOnPostByUser,
);

userPostRoutes.post("/likePostToggle", checkRoleAuth(), UserPostController.likePostToggle);

userPostRoutes.post("/delete", checkRoleAuth(), UserPostController.delete);

userPostRoutes.post("/update", checkRoleAuth(), UserPostController.update);

userPostRoutes.get("/getAllPostForUser", checkRoleAuth(), UserPostController.getAllPostForUser);

userPostRoutes.get("/getAllUserPostByUser", UserPostController.getAllUserPostByUser);

userPostRoutes.get("/getSingleUserPost", checkRoleAuth(), UserPostController.getSingleUserPost);

userPostRoutes.get("/getSingleUserPostUA", UserPostController.getSingleUserPost);

export default userPostRoutes;
