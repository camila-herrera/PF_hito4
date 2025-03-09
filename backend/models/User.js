const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async create({ nombre, email, contraseña }) {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const query = 'INSERT INTO usuarios (nombre, email, contraseña) VALUES ($1, $2, $3) RETURNING *';
    const values = [nombre, email, hashedPassword];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }
}

module.exports = User;
