const userRepository = require('../repositories/userRepository');
const {
  hashPassword,
  comparePassword
} = require('../utils/password');


async function postUser (nome_user, email_user, senha_user){

  const verificaEmail = await userRepository.


}

// async function login(email, senha) {

//   const usuarioEncontrado =
//     await usuarioRepository.buscarPorUsuario(email);

//   if (!usuarioEncontrado) {
//     throw new Error('Usuário ou senha inválidos');
//   }

//   const senhaValida = await comparePassword(
//     senha,
//     usuarioEncontrado.senha
//   );

//   if (!senhaValida) {
//     throw new Error('Usuário ou senha inválidos');
//   }

//   const token = gerarToken({
//     user_id: usuarioEncontrado.user_id,
//     email: usuarioEncontrado.email,
//     perfil: usuarioEncontrado.perfil
//   });

//   return {
//     token,
//     email: usuarioEncontrado.email,
//     nome: usuarioEncontrado.nome,
//     perfil: usuarioEncontrado.perfil,
//   };
// }

module.exports = {
  
}