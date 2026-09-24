import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env, validateEnv } from "./config/env.js";

validateEnv();

const app = createApp();

connectDB()
  .then(() => {
    const server = app.listen(env.port, () => {
      console.log(`flowza API running on port ${env.port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${env.port} is already in use. Stop the process using that port, or change PORT in backend/.env.`
        );
        process.exit(1);
      }

      throw error;
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
