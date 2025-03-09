const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.json({ mensaje: 'Transacción completada exitosamente' });
});

module.exports = router;
