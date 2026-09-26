const express = require('express');
const { adminAcess } = require('../middlewares/adminMiddlewares')

const {
  postUser,
  autenticaUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/post', postUser);
router.post('/auth', autenticaUser);

//router.use(adminAcess);

module.exports = router;


