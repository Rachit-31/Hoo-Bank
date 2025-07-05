import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getAccountDetails, getCreditCardSummary, getUserAccounts } from "../controller/AccountController.js";

const router = Router();


router.route("/getAccount/:userId").get(verifyToken, getUserAccounts)
router.route("/getAccountbyId/:accountId").get(verifyToken, getAccountDetails)
router.route("/getCreditCard").get(verifyToken, getCreditCardSummary);

export default router;