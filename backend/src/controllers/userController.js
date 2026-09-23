const userService = require('../services/userService');

const { verificarToken } = require('../utils/jwt');

// async function login(req, res) {
//   try {
//     const { email, senha } = req.body;

//     if (!email || !senha) {
//       return res.status(400).json({
//         error: 'Usuário e senha são obrigatórios'
//       });
//     }

//     const resultado = await usuarioService.login(email, senha);

//     return res.json(resultado);

//   } catch (error) {
//     console.error(error);

//     return res.status(401).json({
//       error: 'Usuário ou senha inválidos'
//     });
//   }
// };

module.exports = {
  
}