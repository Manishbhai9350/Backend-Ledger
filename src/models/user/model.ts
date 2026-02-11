import mongoose from "mongoose";
import { encrypt } from "../../utils/encryption.js";

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
});

const UserModal = mongoose.model("User", userSchema);

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

userSchema.methods.verifyPassword = function (password: string) {
  const user = this as mongoose.Document & { password: string };
  return encrypt(password) === user.password;
}

export default UserModal;
