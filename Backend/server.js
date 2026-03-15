import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"; // Import auth routes when implemented
import postRoutes from "./routes/postRoutes.js"; // import post routrs when implemented
import productRoutes from "./routes/productRoutes.js"; // Import product routes when implemented
import categoryRoutes from "./routes/categoryRoutes.js"; // Import category routes when implemented
import errorHandler from "./middleware/errorMiddleware.js";

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
app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`.rainbow);
});
