import config from "./configs/config.js";
import app from "./express.js";
import mongoose from "mongoose";

mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoUri)
  .then(() => console.log("Connected to the database!"));
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});


app.listen(config.port, (err) => {
  if (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
  console.info("Server started on port %s.", config.port);
});