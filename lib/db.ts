import mysql from "mysql2/promise";

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || "srv497.hstgr.io",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 30000,
    namedPlaceholders: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });
}

declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: mysql.Pool | undefined;
}

export function getPool() {
  if (!global.mysqlPool) {
    global.mysqlPool = createPool();
  }
  return global.mysqlPool;
}

/** Default export used by simplified API routes (lazy singleton). */
const pool = new Proxy({} as mysql.Pool, {
  get(_target, prop) {
    const real = getPool();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(real) : value;
  },
});

export default pool;

export async function ensureAppointmentsTable() {
  const { ensureAdminSchema } = await import("@/lib/adminSchema");
  await ensureAdminSchema();
}
