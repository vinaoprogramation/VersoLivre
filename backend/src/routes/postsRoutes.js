const express = require('express');
const { adminAcess } = require('../middlewares/adminMiddlewares');
const { acesso } = require("../middlewares/autenticacao");

const {
  enviaPostagem,
  decideStatusPostagem,
  deletaPostagem,
  listaPostagens,
} = require('../controllers/postsController');

const router = express.Router();

router.use(acesso);

router.post('/', enviaPostagem);
router.delete('/', deletaPostagem);
router.get('/', listaPostagens)

router.use(adminAcess);

router.patch('/', decideStatusPostagem);


module.exports = router;


