const express = require('express');
const { adminAcess } = require('../middlewares/adminMiddlewares');
const { acesso } = require("../middlewares/autenticacao");

const {
  enviaComentario,
  deletaComentario,
  listarComentarios,
} = require('../controllers/commentsController');

const router = express.Router();

router.use(acesso);
router.post('/send/:id', enviaComentario)
router.get('/list/:id', listarComentarios)
router.delete('/delete/:id', deletaComentario)

router.use(adminAcess);

module.exports = router;


