// db.js
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL env var is not set");
}

// Create a single connection pool that can be reused by functions
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

module.exports = { query };
