import express from "express";
import { UserController } from "../controllers/user.controller";
import fetchUser from "../middlewares/fetchUser.middleware";

const userRoutes = express.Router();

userRoutes.get("/get", fetchUser, UserController.getUser);

export default userRoutes;
