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


module.exports = {
  enviarPostagem,
  decideStatusPostagem,
  verificaExistenciaPostagem,
}