const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticateToken = (roles = []) => {
  return (req, res, next) => {
       const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];    
    if (!token) {
      return res.status(401).json({ error: 'Token de autenticación no proporcionado.' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido o expirado.' });
      }
      req.user = user; 
      if (roles.length && !roles.includes(user.rol)) {
        return res.status(403).json({ error: 'Acceso denegado: rol insuficiente.' }); 
      }
      next();
    });
  };
};

module.exports = authenticateToken;
