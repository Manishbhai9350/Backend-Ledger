
import { Router } from "express";
import { RegisterUserController, LoginUserController, LogoutUserController } from "../../controllers/auth.controller.js";

const AuthRouter = Router();

AuthRouter.post("/login",LoginUserController);
AuthRouter.post("/register",RegisterUserController);
AuthRouter.post("/logout",LogoutUserController);

export default AuthRouter;
