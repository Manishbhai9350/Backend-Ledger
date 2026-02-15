import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import AuthRouter from "./routes/auth/route.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import { TransactionRouter } from "./routes/transaction/route.js";
import { AccountRouter } from "./routes/account/route.js";

dotenv.config();

connectDB();

const app = express();

// Middlewares

// Better Error Handling Middleware
app.use(errorHandler);

// Other Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Auth Routes

app.use("/auth", AuthRouter);
app.use("/transactions", TransactionRouter)
app.use("/accounts", AccountRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
