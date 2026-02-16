import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { CreateInitialFundTransactionController, CreateTransactionController } from "../../controllers/transaction.controller.js";
import { SystemAuthMiddleware } from "../../middlewares/auth.system.middleware.js";


const router = Router();


router.post('/create',AuthMiddleware,CreateTransactionController)
router.post('/system/initial-funds',SystemAuthMiddleware,CreateInitialFundTransactionController)



export { router as TransactionRouter }