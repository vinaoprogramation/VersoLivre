const pool = require('../config/database');

async function enviarRascunho(titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_autor_user) {

  try {

    const enviaRascunhoQuery = "INSERT INTO postagens (titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_autor_user) VALUES (?, ?, ?, ?, ?)";

    const [enviaRascunho] = await pool.execute(enviaRascunhoQuery, [titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_autor_user]);

    if(enviaRascunho.affectedRows === 0){
      return enviaRascunho.affectedRows;
    }

    const id_envio = enviaRascunho.insertId;

    return {affectedRows: enviaRascunho.affectedRows, id_postagem: id_envio};

  } catch (error) {
    console.error("Erro no banco de dados ao enviar rascunho", error);
    return { erro: "Erro no banco de dados ao enviar rascunho" }
  }

}


async function atualizaRascunho(id_postagem, titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem) {


  try {

    const enviaPostagemQuery = "UPDATE postagens SET titulo_postagem = ?, genero_postagem = ?, classificacao_indicativa_postagem = ?, conteudo_postagem = ? WHERE id_postagem = ?";

    const  enviaPostagem = await pool.execute(enviaPostagemQuery, [titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_postagem]);
  
    return enviaPostagem.affectedRows;

  } catch (error) {
    console.error("Erro no banco de dados ao atualizar postagem", error);
    return { erro: "Erro no banco de dados ao atualizar postagem" }
  }

}


async function enviaPostagem(titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_postagem) {


  try {

    const enviaPostagemQuery = "UPDATE postagens SET titulo_postagem = ?, genero_postagem = ?, classificacao_indicativa_postagem = ?, conteudo_postagem = ? WHERE id_postagem = ?";

    const  enviaPostagem = await pool.execute(enviaPostagemQuery, [titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_postagem]);
  
    return enviaPostagem.affectedRows;

  } catch (error) {
    console.error("Erro no banco de dados ao criar postagem", error);
    return { erro: "Erro no banco de dados ao criar postagem" }
  }

}

async function enviarImagem(id_postagem, dadosBinarios) {

  try {

    const enviaImagemQuery = "UPDATE postagens SET imagem_postagem = ? WHERE id_postagem = ?";

    const [enviaImagem] = await pool.execute(enviaImagemQuery, [dadosBinarios, id_postagem]);

    return enviaImagem.affectedRows;

  } catch (error) {
    console.error("Erro no banco de dados ao enviar imagem", error)
    return { erro: "Erro no banco de dados ao enviar postagem" }
  }

}

async function decideStatusPostagem(status_postagem, id_responsavel_postagem, id_postagem, mensagem) {

  try {

    const enviaStatusQuery = "UPDATE postagens SET status_postagem = ?, id_responsavel_postagem = ?, mensagem = ? WHERE id_postagem = ?";

    const [enviaStatus] = await pool.execute(enviaStatusQuery, [status_postagem, id_responsavel_postagem, mensagem, id_postagem]);

    return enviaStatus.affectedRows;

  } catch (error) {
    console.error("Erro ao atualizar status da postagem", error);
    return { erro: "Erro no banco de dados ao atualizar status postagem" }
  }

}

async function buscaCriadorPostagem(id_postagem) {

  try {

    const buscaCriadorQuery = "SELECT id_autor_user FROM postagens WHERE id_postagem = ?";

    const [buscaCriador] = await pool.execute(buscaCriadorQuery, [id_postagem]);

    const criador = buscaCriador[0].id_autor_user;

    return criador;

  } catch (error) {
    console.error("Erro ao buscar o criador da postagem", error);
    return { erro: "Erro no banco de dados ao buscar o criador postagem" }
  }

}

async function buscaDadosPostagem(id_postagem) {

  try {

    const buscaDadosQuery = "SELECT * FROM postagens WHERE id_postagem = ?";

    const [buscaDados] = await pool.execute(buscaDadosQuery, [id_postagem])

    const dados = buscaDados[0];

    return dados;

  } catch (error) {
    console.error("Erro ao buscar dados da postagem", error);
    return { erro: "Erro no banco de dados ao buscar dados da postagem" }
  }

}

async function buscaRascunho(id_postagem) {

  try{

    const buscaRascunhoQuery = "SELECT titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, imagem_postagem from postagens WHERE id_postagem = ?";

    const [buscaRascunho] = await pool.execute(buscaRascunhoQuery, [id_postagem]);

    return buscaRascunho[0];

  }catch(error){
    console.error("Erro ao buscar rascunho da postagem", error);
    return { erro: "Erro no banco de dados ao buscar rascunho da postagem" }
  }

}


async function verificaExistenciaPostagem(id_postagem) {

  try {

    const verificaExistenciaQuery = 'SELECT EXISTS (SELECT 1 FROM postagens WHERE id_postagem = ? AND is_active = true) AS id_existe';

    const [verificaExistencia] = await pool.execute(verificaExistenciaQuery, [id_postagem]);

    if (verificaExistencia[0].id_existe === 1) {
      return true;
    }

    return false

  } catch (error) {
    console.error("Erro no banco de dados ao verificar existência da postagem", error);
    return { erro: "Erro no banco de dados ao verificar existência da postagem" }
  }

}

async function verificaStatusPostagem(id_postagem) {

  try {

    const verificaStatusQuery = "SELECT status_postagem FROM postagens WHERE id_postagem = ? AND is_active = true";

    const [verificaStatus] = await pool.execute(verificaStatusQuery, [id_postagem])

    const status = verificaStatus[0].status_postagem;

    if (status != "aprovada" && status != "recusada") {
      return false;
    }

    return {
      alterada: true,
      status: status
    };

  } catch (error) {
    console.error("Erro ao verificar status da postagem", error);
    return { erro: "Erro no banco de dados ao verificar status da postagem" }
  }

}

async function deletaPostagem(id_postagem, id_responsavel_delete) {

  try {

    const deletaPostagemQuery = "UPDATE postagens SET is_active = false, id_responsavel_delete = ? WHERE id_postagem = ?";

    const [deletaPostagem] = await pool.execute(deletaPostagemQuery, [id_responsavel_delete, id_postagem]);

    return deletaPostagem.affectedRows;

  } catch (error) {
    console.error("Erro ao deletar logicamente a postagem", error);
    return { erro: "Erro no banco de dados ao deletar logicamente a postagem" }
  }

}

async function deletaRascunho(id_postagem) {

  try {

    const deletaRascunhoQuery = "UPDATE postagens SET is_active = false WHERE id_postagem = ?";

    const [deletaRascunho] = await pool.execute(deletaRascunhoQuery, [id_postagem]);

    return deletaRascunho.affectedRows;

  } catch (error) {
    console.error("Erro ao deletar logicamente o rascunho", error);
    return { erro: "Erro no banco de dados ao deletar logicamente o rascunho" }
  }

}

async function listaPostagens(offset) {

  try {

    const listaPostagensQuery = 'SELECT * FROM postagens WHERE is_active = true AND status_postagem = "aprovada" ORDER BY id_postagem ASC LIMIT 10 OFFSET ? ';

    const [listaPostagens] = await pool.execute(listaPostagensQuery, [(offset - 1) * 10])

    return listaPostagens;

  } catch (error) {
    console.error("Erro ao listar postagens", error);
    return { erro: "Erro no banco de dados ao listar postagens" }
  }

}

async function listaPostagem(id_postagem) {

  try {

    const listaPostagemQuery = 'SELECT p.*, u.nome_user AS autor_nome FROM postagens p LEFT JOIN users u ON p.id_autor_user = u.id_user WHERE p.id_postagem = ?';

    const [listaPostagem] = await pool.execute(listaPostagemQuery, [id_postagem]);

    return listaPostagem[0];

  } catch (error) {
    console.error("Erro ao listar postagem individual", error);
    return { erro: "Erro ao listar postagem individual" }
  }

}

async function contaOffSets() {

  try {

    const contaQuery = "SELECT COUNT(*) as total FROM postagens;"

    const [conta] = await pool.execute(contaQuery);

    const numero = Math.ceil(conta[0].total / 10);

    return numero;

  } catch (error) {
    console.error("Erro ao contar o número de offsets no banco", error);
    return { erro: "Erro no banco de dados ao contar offsets" }
  }
}

async function listaRascunhos(id_autor_user) {

  try {

    const listaRascunhosQuery = "SELECT id_postagem, titulo_postagem, genero_postagem FROM postagens WHERE id_autor_user = ? AND is_active = true AND status_escrita = 'rascunho'";

    const [listaRascunhos] = await pool.execute(listaRascunhosQuery, [id_autor_user]);

    return listaRascunhos;

  } catch (error) {
    console.error("Erro ao listar rascunhos do usuário", error);
    return { erro: "Erro no banco de dados ao listar rascunhos do usuário" }
  }

}

async function buscaRascunho(id_postagem) {

  try {

    const buscaRascunhoQuery = "SELECT titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, imagem_postagem from postagens WHERE id_postagem = ?";

    const [buscaRascunho] = await pool.execute(buscaRascunhoQuery, [id_postagem]);

    return buscaRascunho[0];
    
  } catch (error) {
    console.error("Erro no banco de dados ao buscar rascunho | ", error);
    return {erro: "Erro no banco de dados ao buscar rascunho"}
  }

}

module.exports = {
  enviarRascunho,
  enviaPostagem,
  atualizaRascunho,
  enviarImagem,
  decideStatusPostagem,
  verificaExistenciaPostagem,
  verificaStatusPostagem,
  buscaCriadorPostagem,
  buscaDadosPostagem,
  buscaRascunho,
  deletaPostagem,
  deletaRascunho,
  listaPostagens,
  listaPostagem,
  listaRascunhos,
  contaOffSets,
}