const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');


const register = async (req, res) => {
  const { nombre, apellido, email, password, celular, direccion, ciudad, region, rut } = req.body;

  if (!nombre || !apellido || !email || !password || !celular || !direccion || !ciudad || !region || !rut) {
    return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
  }

  try {
    const userExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1 OR rut = $2', [email, rut]);
    if (userExistente.rows.length > 0) {
      return res.status(400).json({ mensaje: 'El email o el RUT ya están registrados' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, email, password, celular, direccion, ciudad, region, rut, created_at, rol) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), 'usuario') RETURNING *`,
      [nombre, apellido, email, passwordHash, celular, direccion, ciudad, region, rut]
    );

    res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario', error: error.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'El email y la contraseña son requeridos' });
  }

  try {
    const respuesta = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = respuesta.rows[0];

    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario o contraseña incorrectos' });
    }

    const contrasenaValida = await bcrypt.compare(password, usuario.password);
    if (!contrasenaValida) {
      return res.status(400).json({ mensaje: 'Usuario o contraseña incorrectos' });
    }

    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      celular: usuario.celular,
      direccion: usuario.direccion,
      ciudad: usuario.ciudad,
      region: usuario.region,
      rut: usuario.rut,
      rol: usuario.rol
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar el login', error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const usuario = await pool.query('SELECT * FROM usuarios WHERE id = $1', [userId]);

    if (usuario.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const user = usuario.rows[0];

    res.json({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      celular: user.celular,
      direccion: user.direccion,
      ciudad: user.ciudad,
      region: user.region,
      rut: user.rut,
      rol: user.rol
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los detalles del usuario', error: error.message });
  }
};

const updateUser = async (req, res) => {
  const userId = req.user.id; 
  const { nombre, apellido, email, celular, direccion, ciudad, region, rut } = req.body;

  if (!nombre && !apellido && !email && !celular && !direccion && !ciudad && !region && !rut) {
    return res.status(400).json({ mensaje: 'Debe proporcionar al menos un campo para modificar' });
  }

  try {

    const existingUser = await pool.query('SELECT * FROM usuarios WHERE (email = $1 OR rut = $2) AND id != $3', [email, rut, userId]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ mensaje: 'El email o el RUT ya están registrados por otro usuario' });
    }

    const fieldsToUpdate = [];
    const valuesToUpdate = [];

    if (nombre) {
      fieldsToUpdate.push('nombre = $' + (fieldsToUpdate.length + 1));
      valuesToUpdate.push(nombre);
    }
    if (apellido) {
      fieldsToUpdate.push('apellido = $' + (fieldsToUpdate.length + 1));
      valuesToUpdate.push(apellido);
    }
    if (email) {
      fieldsToUpdate.push('email = $' + (fieldsToUpdate.length + 1));
      valuesToUpdate.push(email);
    }
    if (celular) {
      fieldsToUpdate.push('celular = $' + (fieldsToUpdate.length + 1));
      valuesToUpdate.push(celular);
    }
    if (direccion) {
      fieldsToUpdate.push('direccion = $' + (fieldsToUpdate.length + 1));
      valuesToUpdate.push(direccion);
    }
    if (ciudad) {
      fieldsToUpdate.push('ciudad = $' + (fieldsToUpdate.length + 1));
      valuesToUpdate.push(ciudad);
    }
    if (region) {
      fieldsToUpdate.push('region = $' + (fieldsToUpdate.length + 1));
      valuesToUpdate.push(region);
    }
    if (rut) {
      fieldsToUpdate.push('rut = $' + (fieldsToUpdate.length + 1));
      valuesToUpdate.push(rut);
    }


    const query = `UPDATE usuarios 
                   SET ${fieldsToUpdate.join(', ')} 
                   WHERE id = $${fieldsToUpdate.length + 1} 
                   RETURNING *`;

    valuesToUpdate.push(userId);


    const result = await pool.query(query, valuesToUpdate);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({
      mensaje: 'Usuario actualizado correctamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: error.message });
  }
};



module.exports = { register, login, getUserDetails, updateUser };

