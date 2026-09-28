const express = require('express');
const { adminAcess } = require('../middlewares/adminMiddlewares');
const { acesso } = require("../middlewares/autenticacao");

const uploadConfig = require('../config/multer');

const {
  enviaPostagem,
  enviaImagem,
  decideStatusPostagem,
  deletaPostagem,
  listaPostagens,
} = require('../controllers/postsController');

const router = express.Router();

router.use(acesso);

router.post('/', enviaPostagem);
router.post('/file/:id', uploadConfig.single('imagem_postagem'), enviaImagem)
router.delete('/', deletaPostagem);
router.get('/:offset', listaPostagens)

router.use(adminAcess);

router.patch('/', decideStatusPostagem);


module.exports = router;


