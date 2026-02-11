import jwt from "jsonwebtoken";

export const GenerateToken = (
  payload: string | object | Buffer<ArrayBufferLike>,
  secret: jwt.Secret | jwt.PrivateKey,
  expiresIn?: number,
) => {
  if (expiresIn) {
    return jwt.sign(payload, secret, { expiresIn });
  }
  return jwt.sign(payload, secret);
};
