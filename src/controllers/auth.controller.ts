import type { Request, Response } from "express";
import UserModal from "../models/user/model.js";
import type { UserDocument } from "../types/index.js";
import { GenerateToken } from "../utils/jwt.js";
import { sendRegistrationEmail } from "../services/gmail.service.js";
import BlackListModel from "../models/blacklist/model.js";
import { AppError } from "../middlewares/error.middleware.js";

export const RegisterUserController = async (req: Request, res: Response) => {

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const existingUser = await UserModal.findOne({ email });

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists", success: false });
  }

  const newUser = new UserModal({ name, email, password });
  await newUser.save();

  await sendRegistrationEmail(email);

  const AuthToken = GenerateToken(
    {
      id: newUser._id,
      email: newUser.email,
    },
    60 * 60 * 24,
  );

  res
    .cookie("auth_token", AuthToken, { httpOnly: true, secure: false })
    .status(201)
    .json({ message: "User created successfully", success: true });
};

export const LoginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = (await UserModal.findOne({ email }).select(
    "+password",
  )) as UserDocument;

  if (!existingUser) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  const isPasswordValid = existingUser.verifyPassword(password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .cookie("auth_token", "")
      .json({ message: "Invalid password", success: false });
  }

  const AuthToken = GenerateToken(
    {
      id: existingUser._id,
      email: existingUser.email,
    },
    60 * 60 * 24,
  );

  res
    .cookie("auth_token", AuthToken, { httpOnly: true, secure: false })
    .json({ message: "Login successful", success: true });
};

export const LogoutUserController = async (req: Request, res: Response,next: Function) => {
  try {
    const token = req.cookies["auth_token"] || req.headers?.authorization;

    if (!token) {
      return res.status(200).json({
        message: "Already Logged Out",
        success: true,
      });
    }

    const blackListedToken = await BlackListModel.create({
      token,
    });

    return res.status(200).cookie("auth_token", "").json({
      message: "Logged Out Successfully",
      success: true,
    });
  } catch (error: any) {
    // Forward to centralized error handler
    next(
      error instanceof AppError
        ? error
        : new AppError(error.message || "Server Error", 500),
    );
  }
};
