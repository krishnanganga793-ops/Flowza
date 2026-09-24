import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env, validateEnv } from "./config/env.js";

validateEnv();

const app = createApp();

connectDB()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`flowza API running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
