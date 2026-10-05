const express = require('express');
const { adminAcess } = require('../middlewares/adminMiddlewares');
const { acesso } = require("../middlewares/autenticacao");

const uploadConfig = require('../config/multer');

const {
  enviaPostagem,
  enviaRascunho,
  atualizaRascunho,
  enviaImagem,
  decideStatusPostagem,
  deletaPostagem,
  listaPostagens,
  listaPostagem,
  listaRascunhos,
  buscaRascunho,
} = require('../controllers/postsController');

const router = express.Router();

router.use(acesso);

router.post('/', enviaPostagem);
router.post('/sketch', enviaRascunho);
router.put('/update/:id', atualizaRascunho)
router.put('/file/:id', uploadConfig.single('imagem_postagem'), enviaImagem)
router.delete('/', deletaPostagem);
router.get('/sketch/:id', buscaRascunho);
router.get('/on/:offset', listaPostagens)
router.get('/single/:id', listaPostagem)
router.get('/sketches', listaRascunhos)

router.use(adminAcess);

router.patch('/', decideStatusPostagem);


module.exports = router;


