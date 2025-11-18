import config from "./configs/config.js";
import app from "./express.js";
import mongoose from "mongoose";
import { swaggerSpec, swaggerUiMiddleware } from "./configs/swagger.js";
import userRoutes from "./routes/user.routes.js";

mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoUri)
  .then(() => console.log("Connected to the database!"));
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});

// Mount your user routes HERE
app.use("/api/user", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "Welcome to User application. Server healthy." });
});

app.listen(config.port, (err) => {
  if (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
  console.info("Server started on port %s.", config.port);
});

// Swagger
app.use("/api-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));
