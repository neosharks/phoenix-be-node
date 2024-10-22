import express from "express";
import authRoutes from "./auth.route";
import chatRoutes from "./chat.route";
import packageRoutes from "./package.routes";
import userRoutes from "./user.route";
import userPostRoutes from "./userPost.route";
import commonRoutes from "./common.routes";
import notificationRoutes from "./notification.route";
import paymentRoutes from "./payment.route";
import insightRoutes from "./insight.route";
import classRoutes from "./class.route";
import walletRoutes from "./wallet.route";
import offensiveReportRoute from "./offensiveReport.route";
import combinedCommunityRoutes from "./combinedCommunity.route";

const router = express.Router();

router.get("/", (_, res) => res.send("<h1>Healthy server!</h1>"));
router.get("/fail", (_, res) => res.send("<h1>Fail</h1>"));

router.use("/common", commonRoutes);
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/user", userRoutes);
router.use("/package", packageRoutes);
router.use("/userpost", userPostRoutes);
router.use("/notification", notificationRoutes);
router.use("/payment", paymentRoutes);
router.use("/insight", insightRoutes);
router.use("/class", classRoutes);
router.use("/wallet", walletRoutes);
router.use("/offensiveReportive", offensiveReportRoute);
router.use("/combinedCommunity", combinedCommunityRoutes);

export default router;
