import express from "express";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Allow frontend to access uploaded files
app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Allow large form-data uploads (multer needs this BEFORE routes)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Serve frontend build (optional)
const CURRENT_WORKING_DIR = process.cwd();
app.use(express.static(path.join(CURRENT_WORKING_DIR, "dist/app")));

// Routes — CORS already applied above
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Other middleware
app.use(cookieParser());
app.use(compress());
app.use(helmet());

// Global error handler
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: err.name + ": " + err.message });
  }
  console.error(err);
  res.status(500).json({ error: err.message });
});

export default app;
