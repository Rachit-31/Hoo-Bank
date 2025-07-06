import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getAccountDetails, getCreditCardSummary, getUserAccounts } from "../controller/AccountController.js";
import { downloadStatementPDF, getUserTransactions, transferMoney } from "../controller/TransactionController.js";

const router = Router();


router.route("/getAccount/:userId").get(verifyToken, getUserAccounts)
router.route("/getAccountbyId/:accountId").get(verifyToken, getAccountDetails)
router.route("/getCreditCard").get(verifyToken, getCreditCardSummary);
router.route("/makeTransaction/:userId").post(verifyToken, transferMoney);
router.route("/getTransactions/:userId").get(verifyToken, getUserTransactions)
router.route("/downloadPdf/:accountId").post(verifyToken, downloadStatementPDF)

export default router;