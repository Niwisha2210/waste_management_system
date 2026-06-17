// Database Connection Setup
// Using MySQL2 with promise support for async/await

const mysql = require('mysql2/promise');
const config = require('./config');

// Create connection pool
const pool = mysql.createPool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Database connection successful');
    await connection.release();
    return true;
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
  // Wrapper function for queries with error handling
  query: async (sql, values) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(sql, values);
      await connection.release();
      return result;
    } catch (err) {
      console.error('Database query error:', err);
      throw err;
    }
  }
};
