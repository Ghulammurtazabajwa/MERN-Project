import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import authRoutes from "./router/authRoutes.js";
// import adminRoutes from "./router/adminRoutes.js";
// import userRoutes from "./router/userRoutes.js";

// Enable console colors
colors.enable();
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(errorHandler);

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/user", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`.rainbow);
});
