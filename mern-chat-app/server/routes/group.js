const express = require('express');
const { createGroup } = require('../controllers/groupController');

const router = express.Router();

router.post('/create', createGroup); // Route for creating a group

module.exports = router;
