const express = require('express');
const router = express.Router();
const { index, store, edit, update, destroy } = require('../controllers/userController');

router.get('/index', index);
router.post('/store', store);
router.post('/edit/:id', edit);
router.post('/update/:id', update);
router.post('/destroy/:id', destroy);

module.exports = router;