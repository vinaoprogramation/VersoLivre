const express = require('express');
const { adminAcess } = require('../middlewares/adminMiddlewares')
const { acesso } = require("../middlewares/autenticacao");

const {
  postUser,
  autenticaUser,
  cadastraUser,
  listaAdmins,
  alteraRole,
} = require('../controllers/userController');

const router = express.Router();

router.post('/post', postUser);
router.post('/auth', autenticaUser);

router.use(adminAcess);
router.get('/admins', listaAdmins)
router.patch('/switch/:id', alteraRole);
router.post('/post/manual', cadastraUser);

module.exports = router;


