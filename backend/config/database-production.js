const mysql = require("mysql2/promise");
const { Pool } = require("pg"); // PostgreSQL client
require("dotenv").config();

// Check if we're using PostgreSQL (production) or MySQL (local)
const isPostgreSQL =
  process.env.DATABASE_URL && process.env.DATABASE_URL.includes("postgres");

let pool;

if (isPostgreSQL) {
  console.log("Initializing PostgreSQL connection...");
  console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is required for PostgreSQL"
    );
  }

  // PostgreSQL configuration (for Supabase, Railway, etc.)
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    console.log("PostgreSQL pool created successfully");
  } catch (error) {
    console.error("Error creating PostgreSQL pool:", error);
    throw error;
  }
} else {
  console.log("Initializing MySQL connection for local development...");
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
      if (!pool) {
        throw new Error("PostgreSQL pool not initialized");
      }

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
        return result.rows; // Return rows directly for PostgreSQL
      } finally {
        client.release();
      }
    } else {
      // MySQL query
      if (!pool) {
        throw new Error("MySQL pool not initialized");
      }

      const [rows] = await pool.execute(query, params);
      return rows; // Return rows directly for MySQL
    }
  } catch (error) {
    console.error("Database query error:", error);
    console.error("Query:", query);
    console.error("Params:", params);
    throw error;
  }
}

// Test connection function
async function testConnection() {
  try {
    console.log("Testing database connection...");
    console.log("Using PostgreSQL:", isPostgreSQL);

    if (isPostgreSQL) {
      if (!pool) {
        throw new Error("PostgreSQL pool is not initialized");
      }

      const client = await pool.connect();
      console.log("PostgreSQL database connected successfully");

      // Test a simple query
      const result = await client.query("SELECT 1 as test");
      console.log("Test query result:", result.rows);

      client.release();
    } else {
      if (!pool) {
        throw new Error("MySQL pool is not initialized");
      }

      const connection = await pool.getConnection();
      console.log("MySQL database connected successfully");
      connection.release();
    }

    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error("Full error:", error);
    throw error; // Re-throw to propagate the error
  }
}

// Create a unified interface
const database = {
  executeQuery: executeQuery, // Add this method
  execute: executeQuery, // Keep for backward compatibility
  getConnection: async () => ({
    execute: executeQuery,
    executeQuery: executeQuery,
    release: () => {},
  }),
  testConnection,
};

// Don't run test connection on module load - let it be called explicitly
console.log("Database module loaded successfully");

module.exports = database;
