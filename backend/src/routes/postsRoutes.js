const express = require('express');
const { adminAcess } = require('../middlewares/adminMiddlewares');
const { acesso } = require("../middlewares/autenticacao");

const {
  enviaPostagem,
  decideStatusPostagem,
  deletaPostagem,
} = require('../controllers/postsController');

const router = express.Router();

router.use(acesso);

router.post('/post', enviaPostagem);
router.delete('/delete', deletaPostagem);

router.use(adminAcess);

router.patch('/post', decideStatusPostagem);


module.exports = router;


