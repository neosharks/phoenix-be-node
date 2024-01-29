import express from "express";
//------------------------
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { userRole } from "../constant/role.constant";
import { UserPostController } from "../controllers/userPost.controller";

const userPostRoutes = express.Router();

userPostRoutes.post(
  "/createUserPost",
  checkRoleAuth([userRole.CREATOR]),
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

userPostRoutes.get("/getOneUserPost", checkRoleAuth(), UserPostController.getOneUserPost);

export default userPostRoutes;
