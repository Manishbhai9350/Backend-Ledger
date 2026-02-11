import type { Document } from "mongoose";

export type UserDocument = Document & {
  email: string;
  password: string;
  name: string;
  verifyPassword: (val: string) => boolean;
};
