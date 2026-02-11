import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import AuthRouter from "./routes/auth/route.js";

dotenv.config();

connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Auth Routes

app.use("/auth", AuthRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
