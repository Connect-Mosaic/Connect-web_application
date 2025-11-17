import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

const CURRENT_WORKING_DIR = process.cwd();
app.use(cors({
  origin: 'http://localhost:5173',  // Allow frontend to access from this domain
  credentials: true,                // Allow cookies to be sent
}));
app.use(express.static(path.join(CURRENT_WORKING_DIR, "dist/app")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default app;
