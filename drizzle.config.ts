import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

const url = new URL(process.env.DATABASE_URL!);

export default {
  schema: "./src/server/db/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: url.hostname,
    port: Number(url.port || 5432),
    user: url.username,
    password: url.password,
    database: url.pathname.replace(/^\//, ""),
    ssl: url.searchParams.get("sslmode") === "require"
  }
} satisfies Config;
