import express from "express";
import authRoutes from "./auth.route";
import conversationRoutes from "./conversation.route";
import packageRoutes from "./package.routes";
import userRoutes from "./user.route";

const router = express.Router();

router.get("/", (_, res) => res.send("<h1>Healthy server!</h1>"));

router.get("/fail", (_, res) => res.send("<h1>Fail</h1>"));

router.use("/auth", authRoutes);

router.use("/conversation", conversationRoutes);

router.use("/user", userRoutes);

router.use("/package", packageRoutes);

export default router;
