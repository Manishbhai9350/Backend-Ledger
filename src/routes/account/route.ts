import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { CreateAccountController, GetAccountBalance, GetUserAccountController, GetUserAccountsController } from "../../controllers/account.controller.js";


const router = Router()

router.get('/',AuthMiddleware,GetUserAccountsController)
router.get('/:account',AuthMiddleware,GetUserAccountController)
router.get('/balance/:account',AuthMiddleware,GetAccountBalance)
router.post('/create',AuthMiddleware,CreateAccountController)


export { router as AccountRouter }