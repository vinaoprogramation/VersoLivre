const express = require('express');
const { adminAcess } = require('../middlewares/adminMiddlewares');
const { acesso } = require("../middlewares/autenticacao");

const {
  enviaPostagem,
  decideStatusPostagem,
} = require('../controllers/postsController');

const router = express.Router();

router.use(acesso);

router.post('/post', enviaPostagem);

router.use(adminAcess);

router.patch('/post', decideStatusPostagem);

module.exports = router;


