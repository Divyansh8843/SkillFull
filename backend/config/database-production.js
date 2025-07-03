const mysql = require("mysql2/promise");
const { Pool } = require("pg"); // PostgreSQL client
require("dotenv").config();

// Check if we're using PostgreSQL (production) or MySQL (local)
const isPostgreSQL =
  process.env.DATABASE_URL && process.env.DATABASE_URL.includes("postgres");

let pool;

if (isPostgreSQL) {
  // PostgreSQL configuration (for Supabase, Railway, etc.)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });
} else {
  // MySQL configuration (local development)
  const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "skillwave_db",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  pool = mysql.createPool(dbConfig);
}

// Universal query function that works with both MySQL and PostgreSQL
async function executeQuery(query, params = []) {
  try {
    if (isPostgreSQL) {
      // PostgreSQL query
      const client = await pool.connect();
      try {
        // Convert MySQL placeholders (?) to PostgreSQL ($1, $2, etc.)
        let pgQuery = query;
        let paramIndex = 1;
        while (pgQuery.includes("?")) {
          pgQuery = pgQuery.replace("?", `$${paramIndex}`);
          paramIndex++;
        }

        const result = await client.query(pgQuery, params);
        return [result.rows];
      } finally {
        client.release();
      }
    } else {
      // MySQL query
      const [rows] = await pool.execute(query, params);
      return [rows];
    }
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Test connection function
async function testConnection() {
  try {
    if (isPostgreSQL) {
      const client = await pool.connect();
      console.log("PostgreSQL database connected successfully");
      client.release();
    } else {
      const connection = await pool.getConnection();
      console.log("MySQL database connected successfully");
      connection.release();
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
    // Fall back to mock database
    console.log("Falling back to mock database for development");
    const createDatabaseConnection = require("./database-mock");
    return await createDatabaseConnection;
  }
}

// Create a unified interface
const database = {
  execute: executeQuery,
  getConnection: async () => ({
    execute: executeQuery,
    release: () => {},
  }),
  testConnection,
};

testConnection();

module.exports = database;
