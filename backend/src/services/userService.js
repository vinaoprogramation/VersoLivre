const userRepository = require('../repositories/userRepository');
const {
  hashPassword,
  comparePassword
} = require('../utils/password');

const {
  gerarToken,
  verificarToken
} = require('../utils/jwt');


async function postUser(nome_user, email_user, senha_user) {

  const existeEmail = await userRepository.existeUsuario(email_user, null);

  if (existeEmail) {
    return { erro: "Email já cadastrado" };
  }

  const hash = await hashPassword(senha_user);

  if (!hash) {
    return { erro: "Erro ao encriptar senha" }
  }

  const criaUsuario = await userRepository.postaUsuario(nome_user, email_user, hash);

  if (criaUsuario === 0) {
    return { erro: "Erro interno ao cadastrar usuário" };
  }

  return criaUsuario;

}

async function cadastraUser(nome_user, email_user, senha_user, role_user, id_cadastrador) {
  const existeEmail = await userRepository.existeUsuario(email_user, null);

  if (existeEmail) {
    return { erro: "Email já cadastrado" };
  }

  const hash = await hashPassword(senha_user);

  if (!hash) {
    return { erro: "Erro ao encriptar senha" }
  }

  const criaUsuario = await userRepository.cadastraUsuario(nome_user, email_user, hash, role_user);

  if (criaUsuario === 0) {
    return { erro: "Erro interno ao cadastrar usuário" };
  }

  return criaUsuario;
}

async function autenticaUser(email_user, senha_user) {

  const existeEmail = await userRepository.existeUsuario;

  if (!existeEmail) {
    return { erro: "Email ou senha inválidos" }
  }

  const buscaSenha = await userRepository.buscaSenha(email_user);

  if (!buscaSenha) {
    return { erro: "Erro ao buscar senha para comparação" }
  }
  const valida = await comparePassword(senha_user, buscaSenha);

  if (!valida) {
    return { erro: "Email ou senha inválidos" }
  }

  const buscaParaAutenticacao = await userRepository.buscaParaAutenticacao(email_user);

  if (!buscaParaAutenticacao) {
    return { erro: "Erro ao buscar dados para a autenticacao" };
  }

  const id = buscaParaAutenticacao.id;
  const role = buscaParaAutenticacao.role;

  const payload = {
    id_user: id,
    email_user: email_user,
    role_user: role,
  }

  const token = await gerarToken(payload);

  if (!token) {
    return { erro: "Erro ao gerar token de autenticação" }
  }

  return token;

}

module.exports = {
  postUser,
  cadastraUser,
  autenticaUser,
}