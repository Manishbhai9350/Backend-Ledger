import mongoose from "mongoose";
import { decrypt, encrypt } from "../../utils/encryption.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  systemUser: {
    type: Boolean,
    default: false,
    immutable: true,
    select: false,
  },
});

userSchema.methods.verifyPassword = function (password: string) {
  const user = this as mongoose.Document & { password: string };
  return password === decrypt(user.password);
};

userSchema.pre("save", async function (next) {
  const user = this as mongoose.Document & {
    password: string;
    isModified: (field: string) => boolean;
  };

  // If password is not modified, skip hashing
  if (!user.isModified("password")) {
    return;
  }

  // Hash password
  user.password = encrypt(user.password);
});

const UserModal = mongoose.model("User", userSchema);

export default UserModal;
