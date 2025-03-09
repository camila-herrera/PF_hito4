const express = require('express');
const { getUserDetails, updateUser } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken(['usuario', 'admin']), getUserDetails);

router.put('/modificar', authenticateToken(['usuario']), updateUser)

router.get('/:id', authenticateToken, getUserDetails);


module.exports = router;
