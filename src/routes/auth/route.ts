
import { Router } from "express";
import { RegisterUserController, LoginUserController } from "../../controllers/auth.controller.js";

const AuthRouter = Router();

AuthRouter.post("/login",LoginUserController);

AuthRouter.post("/register",RegisterUserController);

export default AuthRouter;
