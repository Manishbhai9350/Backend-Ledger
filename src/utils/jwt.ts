import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET as string;

export const GenerateToken = (
  payload: string | object | Buffer<ArrayBufferLike>,
  expiresIn?: number,
) => {
  if (expiresIn) {
    return jwt.sign(payload, secret, { expiresIn });
  }
  return jwt.sign(payload, secret);
};
