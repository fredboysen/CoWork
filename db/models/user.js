const { pool } = require('../index'); // Assuming your pool is exported from 'index.js' or similar
const bcrypt = require('bcrypt');

async function getUserByEmail(email) {
  const query = 'SELECT * FROM public.users WHERE email = $1';
  const values = [email];

  const result = await pool.query(query, values);
  return result.rows.length > 0 ? result.rows[0] : null;
}

async function createUser(email, hashedPassword, role, phone, name) {
  const query = 'INSERT INTO public.users (email, password, role, phone, name) VALUES ($1, $2, $3, $4, $5) RETURNING user_id';
  const values = [email, hashedPassword, role, phone, name];

  const result = await pool.query(query, values);
  return result.rows[0].user_id;
}

// Other user-related functions...

module.exports = {
  getUserByEmail,
  createUser,
  // Export other functions as needed
};