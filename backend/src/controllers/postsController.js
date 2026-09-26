const postsService = require("../services/postsService");

const {
  gerarToken,
  verificarToken,
  extractBearerToken
} = require('../utils/jwt');


async function enviaPostagem(req, res) {

  try {
    const { titulo_postagem, genero_postagem, classificacao_indicativa_postagem, id_autor_user } = req.body;

    if (!titulo_postagem || !genero_postagem || !classificacao_indicativa_postagem || !id_autor_user) {
      return res.status(404).json({
        mensagem: "Bad request ao enviar postagem"
      });
    }

    if (classificacao_indicativa_postagem != "18" && classificacao_indicativa_postagem != "L") {
      return res.status(404).json({
        mensagem: "Bad request ao enviar postagem"
      });
    }

    const resposta = await postsService.enviaPostagem(titulo_postagem, genero_postagem, classificacao_indicativa_postagem, id_autor_user);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao enviar a postagem"
      })
    }

    return res.status(201).json({
      mensagem: "Postagem enviada com sucesso",
      titulo_postagem: titulo_postagem,
      genero_postagem: genero_postagem,
      classificacao_indicativa_postagem: classificacao_indicativa_postagem,
      id_autor_user: id_autor_user
    })

  } catch (error) {
    console.log("Erro interno ao enviar postagem");
    return res.status(500).json({
      mensagem: "Erro interno ao enviar postagem"
    })
  }

}


async function decideStatusPostagem(req, res) {

  try {

    const { status_postagem, id_responsavel_postagem, id_postagem, mensagem } = req.body;

    if (!status_postagem || !id_responsavel_postagem || !id_postagem) {
      console.log("Parou 1")
      return res.status(404).json({
        mensagem: "Bad request ao alterar o status da postagem"
      })
    }

    if (status_postagem != "aprovada" && status_postagem != "recusada") {
      console.log("Parou 2")
      return res.status(404).json({
        mensagem: "Status inválido"
      })
    }



    const resposta = await postsService.decideStatusPostagem(status_postagem, id_responsavel_postagem, id_postagem, mensagem ? mensagem : null);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao alterar o status da postagem"
      })
    }

    return res.status(200).json({
      mensagem: "Postagem alterada com sucesso",
      status_postagem: status_postagem,
      id_responsavel_postagem: id_responsavel_postagem,
      id_postagem: id_postagem
    })


  } catch (error) {
    console.error("Erro interno ao alterar status da postagem");

    return res.status(500).json({
      mensagem: "Erro interno ao alterar status da postagem"
    })
  }

}

async function deletaPostagem(req, res) {

  try {
    const { id_postagem } = req.body;

    if (!id_postagem) {
      return res.status(404).json({
        mensagem: "Bad request ao deletar postagem"
      })
    }

    const token = await extractBearerToken(req.headers);

    const user = await verificarToken(token);

    if (user.role_user != "admin") {
      const resposta = await postsService.deletaPostagem(id_postagem, user.id_user, null);

      if (resposta && resposta.erro) {
        return res.status(400).json({
          mensagem: "Houve algum problema deletar a postagem"
        })
      }
    } else {
      const resposta = await postsService.deletaPostagem(id_postagem, user.id_user, "admin")

      if (resposta && resposta.erro) {
        return res.status(400).json({
          mensagem: "Houve algum problema ao deletar a postagem"
        })
      }
    }

    return res.status(200).json({
      mensagem: "Postagem deletada com sucesso"
    })



  } catch (error) {
    console.error("Erro interno ao deletar postagem");

    return res.status(500).json({
      mensagem: "Erro interno ao deletar postagem"
    })
  }

}

module.exports = {
  enviaPostagem,
  decideStatusPostagem,
  deletaPostagem,
}