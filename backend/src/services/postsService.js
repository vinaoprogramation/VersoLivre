const postsRepository = require("../repositories/postsRepository");
const userRepository = require("../repositories/userRepository")

const {
  gerarToken,
  verificarToken
} = require('../utils/jwt');


async function enviaRascunho(titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_autor_user) {

  const existeAutor = await userRepository.existeUsuario(null, id_autor_user);

  if (!existeAutor) {
    return { erro: "Autor não existe" }
  }

  let titulo;
  let genero;
  let classificacao;
  let conteudo;

  if (titulo_postagem == null) {
    titulo = "pendente";
  } else {
    titulo = titulo_postagem;
  }

  if (genero_postagem == null) {
    genero = "pendente";
  } else {
    genero = genero_postagem
  }

  if (classificacao_indicativa_postagem == null) {
    classificacao = "L";
  } else {
    classificacao = classificacao_indicativa_postagem
  }

  if (conteudo_postagem == null) {
    conteudo = "pendente";
  } else {
    conteudo = conteudo_postagem
  }

  const envia = await postsRepository.enviarRascunho(titulo, genero, classificacao, conteudo, id_autor_user);

  if (envia === 0) {
    return { erro: "Erro interno ao enviar rascunho" }
  }
  return envia;

}


async function atualizaRascunho(titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_autor_user, id_postagem) {

  const existePostagem = await postsRepository.verificaExistenciaPostagem(id_postagem);

  if (!existePostagem) {
    return { erro: "Postagem referenciada não existe" }
  }


  const existeAutor = await userRepository.existeUsuario(null, id_autor_user);

  if (!existeAutor) {
    return { erro: "Autor não existe" }
  }

  const validaAutor = await postsRepository.buscaCriadorPostagem(id_postagem);

  if (validaAutor != id_autor_user) {
    return { erro: "Id informado não corresponde ao autor da postagem" }
  }

  const buscaDados = await postsRepository.listaPostagem(id_postagem);

  if(buscaDados.length === 0){
    return {erro: "Postagem vazia"}
  }

  let titulo;
  let genero;
  let classificacao;
  let conteudo;

  if (titulo_postagem == null) {
    titulo = buscaDados.titulo_postagem;
  } else {
    titulo = titulo_postagem;
  }

  if (genero_postagem == null) {
    genero = buscaDados.genero_postagem;
  } else {
    genero = genero_postagem
  }

  if (classificacao_indicativa_postagem == null) {
    classificacao = buscaDados.classificacao_indicativa_postagem;
  } else {
    classificacao = classificacao_indicativa_postagem
  }

  if (conteudo_postagem == null) {
    conteudo = buscaDados.conteudo_postagem;
  } else {
    conteudo = conteudo_postagem
  }

  const envia = await postsRepository.atualizaRascunho(titulo, genero, classificacao, conteudo, id_autor_user);

  if (envia === 0) {
    return { erro: "Erro interno ao atualizar rascunho" }
  }

  return envia;

}



async function enviaPostagem(titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_autor_user, id_postagem) {

  const existeAutor = await userRepository.existeUsuario(null, id_autor_user);

  if (!existeAutor) {
    return { erro: "Autor não existe" }
  }

  const validaAutor = await postsRepository.buscaCriadorPostagem(id_postagem);

  if (validaAutor != id_autor_user) {
    return { erro: "Id informado não corresponde ao autor da postagem" }
  }


  const envia = await postsRepository.enviarPostagem(titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_postagem);

  if (envia === 0) {
    return { erro: "Erro interno ao enviar postagem" }
  }

  return envia;

}

async function enviaImagem(id_postagem, buffer, tipo) {

  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {

    return { erro: "Arquivo de imagem inválido" }

  }

  const { fileTypeFromBuffer } = await import('file-type');

  const tipoReal = await fileTypeFromBuffer(buffer);

  if (!tipoReal) {
    return { erro: "Não foi possível identificar o tipo do arquivo" }
  }

  if (!tiposPermitidos.includes(tipoReal.mime)) {
    return { erro: "Tipo de imagem não permitido" }
  }

  if (tipo !== tipoReal.mime) {
    return { erro: "O tipo de arquivo informado não corresponde ao tipo de arquivo enviado" }
  }

  const postagem = await postsRepository.verificaExistenciaPostagem(id_postagem);

  if (!postagem) {
    return { erro: "Postagem não encontrada" }
  }

  const envio = await postsRepository.enviarImagem(id_postagem, buffer);

  if (envio === 0) {
    return { erro: "Erro ao enviar a imagem ao banco de dados" }
  }

  if (envio == "erro") {
    return { erro: envio }
  }

  return envio;

}

async function decideStatusPostagem(status_postagem, id_responsavel_postagem, id_postagem, mensagem) {

  const verificaPostagem = await postsRepository.verificaExistenciaPostagem(id_postagem);

  if (!verificaPostagem) {
    return { erro: "Postagem não existe" };
  }

  const verificaResponsavel = await userRepository.existeUsuario(null, id_responsavel_postagem);

  if (!verificaResponsavel) {
    return { erro: "Usuário não existe" };
  }

  const verificaAutor = await postsRepository.buscaCriadorPostagem(id_postagem);

  if (verificaAutor == id_responsavel_postagem) {
    return { erro: "Usuário não pode auto-aprovar uma postagem" }
  }

  const verificaStatus = await postsRepository.verificaStatusPostagem(id_postagem);

  if (verificaStatus) {
    return { erro: "O status da postagem já foi alterado anteriormente" }
  }

  const decideStatus = await postsRepository.decideStatusPostagem(status_postagem, id_responsavel_postagem, id_postagem, mensagem);

  if (decideStatus === 0) {
    return { erro: "Erro ao fazer o registro da decisão" }
  }

  return decideStatus;

}

async function deletaPostagem(id_postagem, id_responsavel_delete, role_user) {

  const verificaPostagem = await postsRepository.verificaExistenciaPostagem(id_postagem);

  if (!verificaPostagem) {
    return { erro: "Postagem não existe" };
  }

  const verificaResponsavel = await userRepository.existeUsuario(null, id_responsavel_delete);

  if (!verificaResponsavel) {
    return { erro: "Usuário não existe" };
  }

  const verificaAutor = await postsRepository.buscaCriadorPostagem(id_postagem);

  if (verificaAutor == id_responsavel_delete || verificaAutor != id_responsavel_delete && role_user == "admin") {
    const deleteMethod = await postsRepository.deletaPostagem(id_postagem, id_responsavel_delete);

    if (deleteMethod === 0) {

      return { erro: "Erro ao fazer o registro da decisão" }
    }

    return deleteMethod;

  } else {
    return { erro: "O usuário não tem permissão para deletar esta postagem" }
  }

}

async function listaPostagens(offset) {

  const contaOffSet = await postsRepository.contaOffSets();

  if (offset != 1 && offset > contaOffSet) {
    return { erro: "O offset chamado é maior do que o número de offsets no banco" }
  }

  const postagens = await postsRepository.listaPostagens(offset);

  return postagens;

}


async function listaPostagem(id_postagem) {

  const verificaPostagem = await postsRepository.verificaExistenciaPostagem(id_postagem);

  if (!verificaPostagem) {
    return { erro: "Postagem não existe" }
  }

  const verificaStatusPostagem = await postsRepository.verificaStatusPostagem(id_postagem);

  if (!verificaStatusPostagem.status || !verificaPostagem.status == 'aprovada') {
    return { erro: "A postagem não foi aprovada" }
  }

  const buscaPostagem = await postsRepository.listaPostagem(id_postagem);

  if (buscaPostagem.length === 0) {
    return { erro: "Erro ao buscar postagem no banco de dados" }
  }

  return {
    postagem: buscaPostagem,
  };

}

module.exports = {
  enviaRascunho,
  atualizaRascunho,
  enviaPostagem,
  enviaImagem,
  decideStatusPostagem,
  deletaPostagem,
  listaPostagens,
  listaPostagem,
}