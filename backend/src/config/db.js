import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

function configureDnsServers() {
  if (!env.nodeDnsServers.length) {
    return;
  }

  try {
    dns.setServers(env.nodeDnsServers);
    console.log(`Using Node DNS servers: ${env.nodeDnsServers.join(", ")}`);
  } catch (error) {
    throw new Error(
      `Invalid NODE_DNS_SERVERS value "${env.nodeDnsServers.join(", ")}". Use comma-separated DNS server IPs, for example "1.1.1.1,8.8.8.8".`,
      { cause: error }
    );
  }
}

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
  configureDnsServers();

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: env.mongoServerSelectionTimeoutMs
    });
    console.log("MongoDB connected");
  } catch (error) {
    const usesLocalMongo = env.mongoUri?.includes("127.0.0.1") || env.mongoUri?.includes("localhost");
    const isAtlasAuthError = error?.code === 8000 || /bad auth|Authentication failed/i.test(error?.message || "");
    const isSrvDnsError = error?.syscall === "querySrv" || /^querySrv /i.test(error?.message || "");
    const nodeDnsServers = dns.getServers();
    const usesLocalDns = nodeDnsServers.some((server) => server === "127.0.0.1" || server === "::1");
    const usesAtlasMongo = /(?:^mongodb(?:\+srv)?:\/\/|,)ac-|\.mongodb\.net/i.test(env.mongoUri || "");
    const hasConnectionAccessError =
      /connect (?:EACCES|ETIMEDOUT|ECONNREFUSED|ENETUNREACH)/i.test(error?.message || "") ||
      [...(error?.reason?.servers?.values?.() || [])].some((server) =>
        /connect (?:EACCES|ETIMEDOUT|ECONNREFUSED|ENETUNREACH)/i.test(server?.error?.message || "")
      );
    const isAtlasServerSelectionError =
      usesAtlasMongo &&
      (error?.reason?.type === "ReplicaSetNoPrimary" || /Server selection timed out/i.test(error?.message || ""));
    const hint = isAtlasAuthError
      ? "MongoDB Atlas rejected the username/password in MONGODB_URI. Use a Database Access user from Atlas, check the password, and URL-encode any special password characters."
      : isSrvDnsError && usesLocalDns
      ? `Node is trying to resolve the MongoDB Atlas SRV record through local DNS (${nodeDnsServers.join(", ")}). Make sure your local DNS/VPN service is running, change your Windows DNS resolver, or set NODE_DNS_SERVERS in backend/.env to reachable DNS servers.`
      : isSrvDnsError
      ? `Node could not resolve the MongoDB Atlas SRV record using DNS servers ${nodeDnsServers.join(", ")}. Check DNS/VPN/firewall settings, or set NODE_DNS_SERVERS in backend/.env to reachable DNS servers.`
      : usesLocalMongo
      ? "Start MongoDB locally, or replace MONGODB_URI in backend/.env with your MongoDB Atlas connection string."
      : usesAtlasMongo && hasConnectionAccessError
      ? "MongoDB Atlas was found, but this machine cannot open a MongoDB connection to it. In Atlas, add your current IP under Network Access, confirm the cluster is running, and make sure your network/VPN/firewall allows outbound TCP traffic on port 27017."
      : isAtlasServerSelectionError
      ? "MongoDB Atlas hosts were found, but no primary was reachable. In Atlas, check Network Access and add your current IP address, confirm the cluster is running, and make sure your network/VPN/firewall allows outbound TCP traffic on port 27017."
      : "Check that MONGODB_URI in backend/.env is correct and that the database is reachable.";

    error.message = `${error.message}\n\n${hint}${getServerSelectionDetails(error)}`;
    throw error;
  }
}
