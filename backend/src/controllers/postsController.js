const upload = require("../config/multer");
const postsService = require("../services/postsService");

const {
  gerarToken,
  verificarToken,
  extractBearerToken
} = require('../utils/jwt');


async function enviaImagem(req, res) {
  try {

    const id_postagem = Number(req.params.id);

    if (!Number.isInteger(id_postagem) || id_postagem <= 0) {
      return res.status(400).json({
        mensagem: "ID inválido"
      })
    }


    if (!req.file) {
      return res.status(400).json({
        mensagem: "Nenhum arquivo encontrado"
      })
    }

    const { buffer, mimetype } = req.file;

    const resposta = await postsService.enviaImagem(id_postagem, buffer, mimetype);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao enviar a imagem | " + resposta.erro
      })
    }

    return res.status(200).json({
      mensagem: "Imagem enviada com sucesso"
    })

  } catch (error) {
    console.error("Erro interno ao enviar imagem ao banco de dados");

    return res.status(500).json({
      mensagem: "Erro interno ao enviar imagem ao banco de dados" + error.message
    })
  }
}


async function enviaRascunho(req, res) {

  try {
    const { titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem } = req.body;

    const token = await extractBearerToken(req.headers);

    const id_autor_user = await verificarToken(token).id_user;

    if (!titulo_postagem && !genero_postagem && !classificacao_indicativa_postagem && !conteudo_postagem || !id_autor_user) {
      return res.status(404).json({
        mensagem: "Bad request ao enviar rascunho"
      });
    }

    if (classificacao_indicativa_postagem && classificacao_indicativa_postagem != "18" && classificacao_indicativa_postagem != "L") {
      return res.status(404).json({
        mensagem: "Bad request ao enviar rascunho"
      });
    }

    const resposta = await postsService.enviaRascunho(titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_autor_user);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao enviar o rascunho | " + resposta.erro
      })
    }

    return res.status(201).json({
      mensagem: "Rascunho enviado com sucesso",
      id_postagem: resposta.id_postagem,
    })

  } catch (error) {
    console.error("Erro interno ao enviar rascunho", error);
    return res.status(500).json({
      mensagem: "Erro interno ao enviar rascunho"
    })
  }

}


async function atualizaRascunho(req, res) {

  try {

    const id_postagem = req.params.id;

    const token = await extractBearerToken(req.headers);

    const id_autor_user = await verificarToken(token).id_user;

    const { titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem } = req.body;

    if (!titulo_postagem && !genero_postagem && !classificacao_indicativa_postagem && !conteudo_postagem || !id_autor_user || !id_postagem) {
      return res.status(404).json({
        mensagem: "Bad request ao atualizar rascunho"
      });
    }

    if (classificacao_indicativa_postagem && classificacao_indicativa_postagem != "18" && classificacao_indicativa_postagem != "L") {
      return res.status(404).json({
        mensagem: "Bad request ao atualizar rascunho"
      });
    }

    const resposta = await postsService.atualizaRascunho(id_postagem, titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_autor_user);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao atualizar o rascunho | " + resposta.erro
      })
    }

    return res.status(201).json({
      mensagem: "Rascunho atualizado com sucesso",
    })

  } catch (error) {
    console.error("Erro interno ao atualizar rascunho", error);
    return res.status(500).json({
      mensagem: "Erro interno ao atualizar rascunho"
    })
  }

}


async function enviaPostagem(req, res) {

  try {
    const { titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_autor_user, id_postagem } = req.body;

    if (!titulo_postagem || !genero_postagem || !classificacao_indicativa_postagem || !conteudo_postagem || !id_autor_user || id_postagem) {
      return res.status(404).json({
        mensagem: "Bad request ao enviar postagem"
      });
    }

    if (classificacao_indicativa_postagem != "18" && classificacao_indicativa_postagem != "L") {
      return res.status(404).json({
        mensagem: "Bad request ao enviar postagem"
      });
    }

    const resposta = await postsService.enviaPostagem(titulo_postagem, genero_postagem, classificacao_indicativa_postagem, conteudo_postagem, id_autor_user);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao enviar a postagem | " + resposta.erro
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
    console.error("Erro interno ao enviar postagem", error);
    return res.status(500).json({
      mensagem: "Erro interno ao enviar postagem"
    })
  }

}


async function decideStatusPostagem(req, res) {

  try {

    const { status_postagem, id_responsavel_postagem, id_postagem, mensagem } = req.body;

    if (!status_postagem || !id_responsavel_postagem || !id_postagem) {
      return res.status(404).json({
        mensagem: "Bad request ao alterar o status da postagem"
      })
    }

    if (status_postagem != "aprovada" && status_postagem != "recusada") {
      return res.status(404).json({
        mensagem: "Status inválido"
      })
    }



    const resposta = await postsService.decideStatusPostagem(status_postagem, id_responsavel_postagem, id_postagem, mensagem ? mensagem : null);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao alterar o status da postagem | " + resposta.erro
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
          mensagem: "Houve algum problema ao deletar a postagem | " + resposta.erro,
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

async function deletaRascunho(req, res) {

  try {

    const { id_postagem } = req.body;

    const token = await extractBearerToken(req.headers);

    const id_autor_user = await verificarToken(token).id_user;

    if (!id_postagem || !id_autor_user) {
      return res.status(404).json({
        mensagem: "Bad request ao deletar rascunho"
      })
    }

    if (id_postagem <= 0 || !(Number.isInteger(id_postagem))) {
      return res.status(404).json({
        mensagem: "Bad request ao deletar rascunho"
      })
    }

    if (id_autor_user <= 0 || !(Number.isInteger(id_autor_user))) {
      return res.status(404).json({
        mensagem: "Bad request ao deletar rascunho"
      })
    }

    const resposta = await postsService.deletaRascunho(id_postagem, id_autor_user);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao deletar o rascunho | " + resposta.erro
      })
    }

    return res.status(200).json({
      mensagem: "Rascunho deletado com sucesso"
    })

  } catch (error) {
    console.error("Erro interno ao deletar rascunho", error);

    return res.status(500).json({
      mensagem: `Erro interno ao deletar rascunho`
    })
  }

}

async function buscaRascunho(req, res) {

  try {

    const id_postagem = req.params.id;

    const token = await extractBearerToken(req.headers);

    const id_autor_user = await verificarToken(token).id_user;

    if (!id_postagem || !id_autor_user) {
      return res.status(404).json({
        mensagem: "Bad request ao buscar rascunho"
      })
    }

    const resposta = await postsService.buscaRascunho(id_postagem, id_autor_user);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao buscar o rascunho | " + resposta.erro
      })
    }

    return res.status(200).json({
      rascunho: resposta
    })

  } catch (error) {
    console.error("Erro interno ao buscar rascunho");

    return res.status(500).json({
      mensagem: "Erro interno ao buscar rascunho"
    })
  }

}


async function listaRascunhosAdmin(req, res) {

  try {

    const token = await extractBearerToken(req.headers);

    const role = await verificarToken(token).role_user;

    if (role !== "admin") {
      return res.status(403).json({
        mensagem: "Acesso negado"
      })
    }

    const resposta = await postsService.buscaRascunhos();

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao listar os rascunhos | " + resposta.erro
      })
      
    }

    return res.status(200).json({
      rascunhos: resposta
    })

  } catch (error) {
    console.error("Erro interno ao listar rascunhos");

    return res.status(500).json({
      mensagem: "Erro interno ao listar rascunhos"
    })
  }

}




async function listaRascunhos(req, res) {

  try {

    const token = await extractBearerToken(req.headers);

    const id_autor_user = await verificarToken(token).id_user;

    if (!id_autor_user) {
      return res.status(404).json({
        mensagem: "Bad request ao listar rascunhos"
      })
    }

    const resposta = await postsService.listaRascunhos(id_autor_user);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao listar os rascunhos | " + resposta.erro
      })
    }

    return res.status(200).json({
      rascunhos: resposta
    })

  } catch (error) {
    console.error("Erro interno ao listar rascunhos");

    return res.status(500).json({
      mensagem: "Erro interno ao listar rascunhos"
    })
  }

}

async function listaPostagens(req, res) {

  try {

    const offset = req.params.offset;

    let numeroOffset;

    if (offset) {
      numeroOffset = parseInt(offset);
    }



    if (numeroOffset <= 0 || !(Number.isInteger(numeroOffset))) {
      return res.status(404).json({
        mensagem: "Bad request ao listar as postagens"
      })
    }

    const resposta = await postsService.listaPostagens(numeroOffset);

    if (resposta && resposta.erro == 'O offset chamado é maior do que o número de offsets no banco') {
      return res.status(200).json({
        mensagem: "O índice de busca é maior do que a quantidade de postagens existentes"
      })
    }

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao listar as postagens | " + resposta.erro,
      })
    }

    if (resposta.length === 0) {
      return res.status(200).json({
        mensagem: "Não existem postagens no momento",
        postagens: resposta
      })
    }

    return res.status(200).json({
      postagens: resposta
    })

  } catch (error) {
    console.error("Erro interno ao listar as postagens");

    return res.status(500).json({
      mensagem: "Erro interno ao listar as postagens",
    })
  }

}

async function listaPostagem(req, res) {

  try {

    const id_postagem = req.params.id;

    if (!id_postagem) {
      return res.status(404).json({
        mensagem: "Bad request ao listar postagem individualmente"
      })
    }

    const id = parseInt(id_postagem);

    if (id <= 0 || !(Number.isInteger(id))) {
      return res.status(404).json({
        mensagem: "Bad request ao listar postagem"
      })
    }

    const resposta = await postsService.listaPostagem(id);

    if (resposta && resposta.erro) {
      return res.status(400).json({
        mensagem: "Houve algum problema ao listar a postagem | " + resposta.erro
      })
    }

    return res.status(200).json({
      postagem: resposta.postagem,
      autor: resposta.autor
    })


  } catch (error) {
    console.error("Erro interno ao listar postagem individual | ", error);

    return res.status(500).json({
      mensagem: "Erro interno ao listar postagem individual"
    })
  }

}


module.exports = {
  enviaPostagem,
  atualizaRascunho,
  enviaRascunho,
  decideStatusPostagem,
  deletaPostagem,
  deletaRascunho,
  buscaRascunho,
  listaRascunhosAdmin,
  listaRascunhos,
  listaPostagens,
  listaPostagem,
  enviaImagem,
}