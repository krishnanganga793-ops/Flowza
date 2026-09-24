import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function normalizeMongoUri(uri) {
  return uri?.replace(/(mongodb(?:\+srv)?:\/\/[^/?#]+\/[^/?#]+)\/(\?|$)/i, "$1$2");
}

function parseList(value) {
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) || [];
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: normalizeMongoUri(process.env.MONGODB_URI),
  mongoServerSelectionTimeoutMs: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000),
  nodeDnsServers: parseList(process.env.NODE_DNS_SERVERS),
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTtl: process.env.ACCESS_TOKEN_TTL || "15m",
  refreshTtl: process.env.REFRESH_TOKEN_TTL || "7d",
  cookieSecret: process.env.COOKIE_SECRET || "focusflow-cookie",
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || "flowza <noreply@flowza.app>"
  }
};

export function validateEnv() {
  const missing = ["mongoUri", "accessSecret", "refreshSecret"].filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const placeholderPattern = /<|>|(^|[:/@])(?:USER|PASSWORD|db_username)([:/@]|$)/i;
  if (placeholderPattern.test(env.mongoUri)) {
    throw new Error(
      "MONGODB_URI contains placeholder credentials. Replace the username and password in backend/.env with a real MongoDB Atlas database user."
    );
  }
}
