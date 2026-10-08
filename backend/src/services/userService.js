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

async function listaAdmins(id_user) {

  const verificaId = await userRepository.buscaRole(id_user);

  if (verificaId != "admin") {
    return { erro: "Usuário não é administrador" }
  }

  const lista = await userRepository.listaAdmins();

  if (lista.length === 0) {
    return { erro: "Não á usuários cadastrados" }
  }

  return lista;

}

async function alteraRole(role, id_user, id_admin) {

  const verificaId = await userRepository.buscaRole(id_admin);

  if (verificaId != "admin") {
    return { erro: "Usuário não é administrador" }
  }

  const altera = await userRepository.alteraRole(role, id_user)

  if (altera === 0) {
    return { erro: "O usuário já detém este role" }
  }

  return altera;

}

module.exports = {
  postUser,
  cadastraUser,
  autenticaUser,
  listaAdmins,
  alteraRole,
}