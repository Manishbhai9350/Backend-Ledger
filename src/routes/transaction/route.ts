import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { CreateTransactionController } from "../../controllers/transaction.controller.js";


const router = Router();


router.post('/create',AuthMiddleware,CreateTransactionController)



export { router as TransactionRouter }