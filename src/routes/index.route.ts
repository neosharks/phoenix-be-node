import express from "express";
import authRoutes from "./auth.route";
import conversationRoutes from "./conversation.route";
import packageRoutes from "./package.routes";
import userRoutes from "./user.route";
import userPostRoutes from "./userPost.route";
import commonRoutes from "./common.routes";

const router = express.Router();

router.get("/", (_, res) => res.send("<h1>Healthy server!</h1>"));
router.get("/fail", (_, res) => res.send("<h1>Fail</h1>"));

router.use("/common", commonRoutes);
router.use("/auth", authRoutes);
router.use("/conversation", conversationRoutes);
router.use("/user", userRoutes);
router.use("/package", packageRoutes);
router.use("/userpost", userPostRoutes);

export default router;
