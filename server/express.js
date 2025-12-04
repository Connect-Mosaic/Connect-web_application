import express from "express";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import path from "path";

// Swagger
import { swaggerSpec, swaggerUiMiddleware } from "./configs/swagger.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import searchRoutes from "./routes/search.routes.js";
import eventRoutes from "./routes/event.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import notificationRoutes from "./routes/notification.route.js";
import friendRoutes from "./routes/friend.routes.js";

const app = express();

/* ============================================================
   CORS
============================================================ */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* ============================================================
   BODY PARSERS (must be before routes)
============================================================ */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(compress());

/* ============================================================
   SECURITY HEADERS
============================================================ */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "*", "data:", "blob:"],
      },
    },
  })
);

/* ============================================================
   STATIC FILE SERVING
============================================================ */
const CURRENT_WORKING_DIR = process.cwd();
app.use(express.static(path.join(CURRENT_WORKING_DIR, "dist/app")));

// Serve uploaded images
app.use("/uploads", cors(), express.static("uploads"));

/* ============================================================
   ROUTES
============================================================ */
app.use("/api/search", searchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/friends", friendRoutes);

/* ============================================================
   HEALTH CHECK
============================================================ */
app.get("/api/health", (req, res) => {
  res.json({ message: "Welcome to User application. Server healthy." });
});

/* ============================================================
   SWAGGER
============================================================ */
app.use("/api-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));

/* ============================================================
   GLOBAL ERROR HANDLER
============================================================ */
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: err.name + ": " + err.message });
  }
  console.error(err);
  res.status(500).json({ error: err.message });
});

export default app;
