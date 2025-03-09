const pool = require('../config/db');

const Product = {
  async getAll() {
    const result = await pool.query('SELECT id_producto, nombre, descripcion, imagen_url, stock, precio FROM productos');
    return result.rows;
  },

  async create({ nombre, descripcion, precio, categoria, stock, imagen_url }) {
    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, categoria, stock, imagen_url) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, descripcion, precio, categoria, stock, imagen_url]
    );
    return result.rows[0];
  },

  async updateStock(id, stock) {
    const result = await pool.query(
      `UPDATE productos 
       SET stock=$1 
       WHERE id_producto=$2 
       RETURNING id_producto, stock`,
      [stock, id]
    );
    return result.rows[0]; 
  },

  async update(id, { nombre, descripcion, precio, categoria, stock, imagen_url }) {
    const result = await pool.query(
      `UPDATE productos 
       SET nombre=$1, descripcion=$2, precio=$3, categoria=$4, stock=$5, imagen_url=$6 
       WHERE id_producto=$7 RETURNING *`,
      [nombre, descripcion, precio, categoria, stock, imagen_url, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM productos WHERE id_producto=$1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Product;
