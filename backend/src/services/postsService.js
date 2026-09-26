const postsRepository = require("../repositories/postsRepository");
const userRepository = require("../repositories/userRepository")

const {
  gerarToken,
  verificarToken
} = require('../utils/jwt');

async function enviaPostagem(titulo_postagem, genero_postagem, classificacao_indicativa_postagem, id_autor_user){

  const existeAutor = await userRepository.existeUsuario(null, id_autor_user);

  if(!existeAutor){
    return {erro: "Autor não existe"}  
  }

  

  const envia = await postsRepository.enviarPostagem(titulo_postagem, genero_postagem, classificacao_indicativa_postagem, id_autor_user);

  if(envia === 0){
    return {erro: "Erro interno ao enviar postagem"}
  }

  return envia;

}

async function decideStatusPostagem(status_postagem, id_responsavel_postagem , id_postagem, mensagem){

  const verificaPostagem = await postsRepository.verificaExistenciaPostagem(id_postagem);

  if(!verificaPostagem){
    return {erro: "Postagem não existe"};
  }  

  const verificaResponsavel = await userRepository.existeUsuario(null, id_responsavel_postagem);

  if(!verificaResponsavel){
    return {erro: "Usuário não existe"};
  }

  const verificaAutor = await postsRepository.buscaCriadorPostagem(id_postagem);

  if(verificaAutor == id_responsavel_postagem){
    console.log("Auto-aprovação")
    return {erro: "Usuário não pode auto-aprovar uma postagem"}
  }

  const verificaStatus = await postsRepository.verificaStatusPostagem(id_postagem);

  if(verificaStatus){
    console.log("Status alterado")
    return {erro: "O status da postagem já foi alterado anteriormente"}
  }

  const decideStatus = await postsRepository.decideStatusPostagem(status_postagem, id_responsavel_postagem, id_postagem, mensagem);

  if(decideStatus === 0){
    console.log("Erro ao fazer registro")
    return {erro: "Erro ao fazer o registro da decisão"}
  }

  return decideStatus;

}


module.exports = {
  enviaPostagem,
  decideStatusPostagem,
}