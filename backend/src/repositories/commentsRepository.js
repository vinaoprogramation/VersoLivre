const pool = require('../config/database');


async function enviaComentario(id_postagem, id_autor, mensagem) {
  try {

    const enviaQuery = "INSERT INTO comentarios (mensagem_comentario, id_postagem, id_autor_comentario) VALUES (?, ?, ?)";

    const [envia] = await pool.execute(enviaQuery, [mensagem, id_postagem, id_autor]);

    return envia.affectedRows;

  } catch (error) {
    console.error("Erro no banco de dados ao enviar comentário |", error);
    return false;
  }
}

async function buscaAutorComentario(id_comentario) {
  try {

    const enviaQuery = "SELECT id_autor_comentario FROM comentarios WHERE id_comentario = ?";

    const [envia] = await pool.execute(enviaQuery, [id_comentario]);

    return envia[0].id_autor_comentario;

  } catch (error) {
    console.error("Erro no banco de dados ao buscar autor do comentário |", error);
    return false;
  }
}

async function deletaComentario(id_comentario) {
  try {

    const enviaQuery = "UPDATE comentarios SET is_active = false WHERE id_comentario = ?";

    const [envia] = await pool.execute(enviaQuery, [id_comentario]);

    return envia.affectedRows;

  } catch (error) {
    console.error("Erro no banco de dados ao excluir comentário");
    return false;
  }
}

async function listarComentarios(id_postagem) {
  try {

    const [postagem] = await pool.execute("SELECT id_postagem FROM postagens WHERE id_postagem = ?", [id_postagem]);

    if(postagem.length === 0){
      return {erro: "Postagem não existe"}
    }

    const listaQuery = "SELECT c.id_comentario, c.mensagem_comentario, u.nome_user FROM comentarios c INNER JOIN users u ON c.id_autor_comentario = u.id_user WHERE c.id_postagem = ? AND c.is_active = true";

    const [lista] = await pool.execute(listaQuery, [id_postagem]);

    return lista;

  } catch (error) {
    console.error("Erro no banco de dados ao listar comentários");
    return false;
  }
}


module.exports = {
  enviaComentario,
  deletaComentario,
  buscaAutorComentario,
  listarComentarios,
}