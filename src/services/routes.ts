import { Router } from "express";
import User from "./user/user.route";
import dailyDrug from "./dailyMed/dailyMed.route";
import openPaymentData from "./openPaymentData/openPaymentData.route";
import payment from "./stripe/stripe.route";

const router = Router();

router.use("/user", User);
router.use("/drug", dailyDrug);
router.use("/stats", openPaymentData);
router.use("/payment", payment);

export default router;