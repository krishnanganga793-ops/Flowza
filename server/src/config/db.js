import mongoose from "mongoose";
import { env } from "./env.js";

function getServerSelectionDetails(error) {
  const servers = error?.reason?.servers;
  if (!(servers instanceof Map)) {
    return "";
  }

  const details = [...servers.entries()]
    .map(([address, server]) => {
      const message = server?.error?.message || server?.error?.reason || server?.type;
      return message ? `${address}: ${message}` : null;
    })
    .filter(Boolean);

  return details.length ? `\n\nServer selection details:\n${details.join("\n")}` : "";
}

export async function connectDB() {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: env.mongoServerSelectionTimeoutMs
    });
    console.log("MongoDB connected");
  } catch (error) {
    const usesLocalMongo = env.mongoUri?.includes("127.0.0.1") || env.mongoUri?.includes("localhost");
    const isAtlasAuthError = error?.code === 8000 || /bad auth|Authentication failed/i.test(error?.message || "");
    const isAtlasServerSelectionError =
      env.mongoUri?.startsWith("mongodb+srv://") &&
      (error?.reason?.type === "ReplicaSetNoPrimary" || /Server selection timed out/i.test(error?.message || ""));
    const hint = isAtlasAuthError
      ? "MongoDB Atlas rejected the username/password in MONGODB_URI. Use a Database Access user from Atlas, check the password, and URL-encode any special password characters."
      : usesLocalMongo
      ? "Start MongoDB locally, or replace MONGODB_URI in .env with your MongoDB Atlas connection string."
      : isAtlasServerSelectionError
      ? "MongoDB Atlas hosts were found, but no primary was reachable. In Atlas, check Network Access and add your current IP address, confirm the cluster is running, and make sure your network/VPN/firewall allows outbound TCP traffic on port 27017."
      : "Check that MONGODB_URI in .env is correct and that the database is reachable.";

    error.message = `${error.message}\n\n${hint}${getServerSelectionDetails(error)}`;
    throw error;
  }
}
