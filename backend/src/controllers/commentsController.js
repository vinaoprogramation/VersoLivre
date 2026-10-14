const postsService = require("../services/postsService");
const commentsService = require("../services/commentsService");

const {
  gerarToken,
  verificarToken,
  extractBearerToken
} = require('../utils/jwt');


async function enviaComentario(req, res) {

  try {

    const id_postagem = req.params.id;

    const { mensagem } = req.body;

    const token = await extractBearerToken(req.headers);

    if (!token) {
      return res.status(403).json({
        mensagem: "Acesso negado"
      })
    }

    const id_autor = await verificarToken(token).id_user;

    if (!id_autor) {
      return res.status(403).json({
        mensagem: "Id inválido"
      })
    }

    if (!id_postagem || !mensagem || mensagem == null || mensagem == "") {
      return res.status(400).json({
        mensagem: "Bad request"
      })
    }

    const resposta = await commentsService.enviaComentario(id_postagem, id_autor, mensagem);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao enviar o comentário"
      })
    }

    return res.status(200).json({
      mensagem: "Comentário enviado com sucesso"
    })

  } catch (error) {
    console.error("Erro interno ao enviar comentário | ", error);

    return res.status(500).json({
      mensagem: "Erro interno ao enviar comentário"
    })
  }

}



async function deletaComentario(req, res) {

  try {

    const id_comentario = req.params.id;

    const token = await extractBearerToken(req.headers);

    if (!token) {
      return res.status(403).json({
        mensagem: "Acesso negado"
      })
    }

    const payload = await verificarToken(token);

    const id_autor = payload.id_user;

    const role = payload.role_user;

    if (!id_autor || !role) {
      return res.status(403).json({
        mensagem: "Token inválido"
      })
    }

    if (!id_comentario) {
      return res.status(400).json({
        mensagem: "Bad request"
      })
    }

    const resposta = await commentsService.deletaComentario(id_autor, id_comentario, role);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao excluir o comentário"
      })
    }

    return res.status(204).json({
      mensagem: "Comentário excluido com sucesso"
    })

  } catch (error) {
    console.error("Erro interno ao excluir comentário | ", error);

    return res.status(500).json({
      mensagem: "Erro interno ao excluir comentário"
    })
  }

}

async function listarComentarios(req, res) {

  try {

    const id_postagem = req.params.id;

    if (!id_postagem || Number.isNaN(Number(id_postagem))) {
      return res.status(400).json({
        mensagem: "Id da postagem inválido"
      })
    }

    const resposta = await commentsService.listarComentarios(id_postagem);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Erro ao listar comentários"
      })
    }

    return res.status(200).json({
      comentarios: resposta,
    })

  } catch (error) {
    console.error("Erro interno ao listar comentários da postagem | ", error);

    return res.status(500).json({
      mensagem: "Erro interno ao listar comentários da postagem",
    })
  }

}

module.exports = {
  enviaComentario,
  deletaComentario,
  listarComentarios,
}
