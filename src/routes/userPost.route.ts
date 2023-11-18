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

userPostRoutes.get("/getAllUserPostByUser", UserPostController.getAllUserPostByUser);

userPostRoutes.get("/getOneUserPost", checkRoleAuth(), UserPostController.getOneUserPost);

export default userPostRoutes;
