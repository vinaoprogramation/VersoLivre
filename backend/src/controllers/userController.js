const userService = require('../services/userService');

const {
  gerarToken,
  verificarToken,
  extractBearerToken
} = require('../utils/jwt');

async function postUser(req, res) {

    try {

        const { nome_user, email_user, senha_user } = req.body;

        if (!nome_user || !email_user || !senha_user) {
            return res.status(400).json({
                mensagem: 'Bad Request ao postar usuário'
            })
        }

        const resposta = await userService.postUser(nome_user, email_user, senha_user);

        if (resposta && resposta.erro) {
            return res.status(400).json({
                mensagem: "Houve algum problema ao postar o usuário"
            })
        }

        return res.status(201).json({
            mensagem: "Usuário criado com sucesso",
            nome: nome_user,
            email: email_user
        })



    } catch (error) {
        console.error('Erro ao postar usuário', error);

        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        })
    }

}


async function cadastraUser(req, res) {

    try {

        const { nome_user, email_user, senha_user, role_user } = req.body;

        if (!nome_user || !email_user || !senha_user || !role_user) {
            return res.status(400).json({
                mensagem: 'Bad Request ao postar usuário'
            })
        }

        const token = await extractBearerToken(req.headers);

        const id_cadastrador = await verificarToken(token).id_user;

        const resposta = await userService.cadastraUser(nome_user, email_user, senha_user, role_user, id_cadastrador);

        if (resposta && resposta.erro) {
            return res.status(400).json({
                mensagem: "Houve algum problema ao cadastrar o usuário"
            })
        }

        return res.status(201).json({
            mensagem: "Usuário criado com sucesso",
            nome: nome_user,
            email: email_user,
            role: role_user,
            cadastrador: id_cadastrador
        })

    } catch (error) {
        console.error('Erro ao cadastrar usuário', error);

        return res.status(500).json({
            mensagem: 'Erro interno do servidor ao cadastrar o usuário'
        })
    }

}


async function autenticaUser(req, res) {

    try {

        const { email_user, senha_user } = req.body;

        if (!email_user || !senha_user) {
            return res.status(400).json({
                mensagem: "Bad request ao autenticar usuario"
            })
        }

        const resposta = await userService.autenticaUser(email_user, senha_user);

        if (resposta && resposta.erro) {
            return res.status(400).json({
                mensagem: "Houve algum problema ao autenticar o usuário"
            })
        }

        return res.status(200).json({
            mensagem: "Usuário autenticado com sucesso",
            token: resposta,
        })

    } catch (error) {
        console.error("Erro ao autenticar o usuário");
        return res.status(500).json({
            mensagem: "Erro interno ao autenticar o usuário"
        })
    }

}


module.exports = {
    postUser,
    autenticaUser,
    cadastraUser,
}