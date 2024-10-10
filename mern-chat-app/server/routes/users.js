const express = require('express');
const { registerUser, loginUser, getAllUsers ,getAllUsersExcludingCurrent} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers); // Get all users
router.get('/', getAllUsersExcludingCurrent); // Get all users excluding the current user


module.exports = router;
