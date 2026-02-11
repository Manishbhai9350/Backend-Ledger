import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log(process.env.MONGO_DB_URL);
    await mongoose.connect(process.env.MONGO_DB_URL as string);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with an error code
  }
};
