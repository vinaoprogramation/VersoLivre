const express = require('express');
const { adminAcess } = require('../middlewares/adminMiddlewares')

const {
  postUser,
  autenticaUser,
  cadastraUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/post', postUser);
router.post('/auth', autenticaUser);

router.use(adminAcess);

router.post('/post/manual', cadastraUser);

module.exports = router;


