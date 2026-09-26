const pool = require('../config/database');

async function enviarPostagem(titulo_postagem, genero_postagem, classificacao_indicativa_postagem, id_autor_user) {

  try {

    const enviaPostagemQuery = "INSERT INTO postagens (titulo_postagem, genero_postagem, classificacao_indicativa_postagem, id_autor_user) VALUES (?, ?, ?, ?)";

    const enviaPostagem = await pool.execute(enviaPostagemQuery, [titulo_postagem, genero_postagem, classificacao_indicativa_postagem, id_autor_user]);

    return enviaPostagem.affectedRows;

  } catch (error) {
    console.error("Erro no banco de dados ao criar postagem", error);
  }

}


async function decideStatusPostagem(status_postagem, id_responsavel_postagem, id_postagem, mensagem) {

  try {

    const enviaStatusQuery = "UPDATE postagens SET status_postagem = ?, id_responsavel_postagem = ?, mensagem = ? WHERE id_postagem = ?";

    const [enviaStatus] = await pool.execute(enviaStatusQuery, [status_postagem, id_responsavel_postagem, mensagem, id_postagem]);

    return enviaStatus.affectedRows;

  } catch (error) {
    console.error("Erro ao atualizar status da postagem", error);
  }

}

async function buscaCriadorPostagem(id_postagem){

  try {
    
    const buscaCriadorQuery = "SELECT id_autor_user FROM postagens WHERE id_postagem = ?";

    const [buscaCriador] = await pool.execute(buscaCriadorQuery, [id_postagem]);

    const criador = buscaCriador[0].id_autor_user;

    return criador;

  } catch (error) {
    console.error("Erro ao buscar o criador da postagem");
  }

}

async function buscaDadosPostagem(id_postagem){

  try {

    const buscaDadosQuery = "SELECT * FROM postagens WHERE id_postagem = ?";

    const [buscaDados] = await pool.execute(buscaDadosQuery, [id_postagem])

    const dados = buscaDados[0];

    return dados;
    
  } catch (error) {
    console.error("Erro ao buscar dados da postagem")
  }

}

async function verificaExistenciaPostagem(id_postagem) {

  try {

    const verificaExistenciaQuery = 'SELECT EXISTS (SELECT 1 FROM postagens WHERE id_postagem = ?) AS id_existe';

    const [verificaExistencia] = await pool.execute(verificaExistenciaQuery, [id_postagem]);

    if(verificaExistencia[0].id_existe === 1){
      return true;
    }

    return false

  } catch (error) {
    console.error("Erro no banco de dados ao verificar existência da postagem", error);
  }

}

async function verificaStatusPostagem(id_postagem){

  try {

  const verificaStatusQuery = "SELECT status_postagem FROM postagens WHERE id_postagem = ?";

  const [verificaStatus] = await pool.execute(verificaStatusQuery, [id_postagem])

  const status = verificaStatus[0].status_postagem;

  if(status != "aprovada" && status != "recusada"){
    return false;
  }

  return true;
    
  } catch (error) {
    console.error("Erro ao verificar status da postagem")
  }

}


module.exports = {
  enviarPostagem,
  decideStatusPostagem,
  verificaExistenciaPostagem,
  verificaStatusPostagem,
  buscaCriadorPostagem,
  buscaDadosPostagem,
}