const { use } = require('../routes/userRoutes');
const userService = require('../services/userService');

const { verificarToken } = require('../utils/jwt');


async function postUser(req, res) {
    
    try{

        const {nome_user, email_user, senha_user} = req.body;

        if(!nome_user || !email_user || !senha_user){
            return res.status(400).json({
                mensagem:'Bad Request ao postar usuário'
            })
        }

        const resposta = await userService.


    }catch(error){
        console.error('Erro ao postar usuário', error);

        return res.status(500).json({
            mensagem: 'Dados inválidos'
        })
    }

}

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