import mysql from "mysql2/promise";

const required = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"] as const;

function getDbConfig() {
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  return {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
  };
}

declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

export function getPool() {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool(getDbConfig());
  }
  return global.mysqlPool;
}

export async function ensureAppointmentsTable() {
  const { ensureAdminSchema } = await import("@/lib/adminSchema");
  await ensureAdminSchema();
}
