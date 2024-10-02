import express from "express";
//------------------------
import { checkRoleAuth } from "../middlewares/checkRoleAuth.middleware";
import { userRole } from "../constant/role.constant";
import { UserPostController } from "../controllers/userPost.controller";

const userPostRoutes = express.Router();

// -----------  GET ----------------

userPostRoutes.get("/getAllPostForUser", checkRoleAuth(), UserPostController.getAllPostForUser);

userPostRoutes.get(
  "/getAllUserPostByUser",
  checkRoleAuth(),
  UserPostController.getAllUserPostByUser,
);

userPostRoutes.get("/getSingleUserPost", checkRoleAuth(), UserPostController.getSingleUserPost);

userPostRoutes.get("/getSingleUserPostUA", checkRoleAuth(), UserPostController.getSingleUserPost);

userPostRoutes.get("/getAllPost", checkRoleAuth(), UserPostController.getAllPost);

// -----------  POST ----------------

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

userPostRoutes.post("/voteOnPoll", checkRoleAuth(), UserPostController.voteOnPoll);

userPostRoutes.post("/delete", checkRoleAuth(), UserPostController.delete);

userPostRoutes.post("/update", checkRoleAuth(), UserPostController.update);

export default userPostRoutes;
