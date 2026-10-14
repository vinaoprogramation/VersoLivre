const postsRepository = require("../repositories/postsRepository");
const userRepository = require("../repositories/userRepository");
const commentsRepository = require("../repositories/commentsRepository");

const {
  gerarToken,
  verificarToken
} = require('../utils/jwt');

async function enviaComentario(id_postagem, id_autor, mensagem){

  const resposta = await commentsRepository.enviaComentario(id_postagem, id_autor, mensagem);

  if(resposta === 0){
    return {erro: "Comentário não foi enviado"}
  }

  return resposta;

}

async function deletaComentario(id_autor, id_comentario, role){

  const verificaAutor = await commentsRepository.buscaAutorComentario(id_comentario)

  if(verificaAutor != id_autor && role != "admin"){
    return {erro: "Usuário não tem permissão para excluir o comentário"}
  }

  const resposta = await commentsRepository.deletaComentario(id_comentario);

  if(resposta === 0){
    return {erro: "Comentário não foi excluido"}
  }

  return resposta;

}

async function listarComentarios(id_postagem) {

  const listaComentarios = await commentsRepository.listarComentarios(id_postagem);

  return listaComentarios;

}

module.exports = {
  enviaComentario,
  deletaComentario,
  listarComentarios,
}