import { Router } from "express";
import { AuthMiddleware, BlackListMiddleware } from "../../middlewares/auth.middleware.js";
import { CreateAccountController, GetAccountBalance, GetUserAccountController, GetUserAccountsController } from "../../controllers/account.controller.js";


const router = Router()

router.get('/',AuthMiddleware,BlackListMiddleware,GetUserAccountsController)
router.get('/:account',AuthMiddleware,BlackListMiddleware,GetUserAccountController)
router.get('/balance/:account',AuthMiddleware,BlackListMiddleware,GetAccountBalance)
router.post('/create',AuthMiddleware,BlackListMiddleware,CreateAccountController)


export { router as AccountRouter }