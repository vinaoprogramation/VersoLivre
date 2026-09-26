const { verificarToken, extractBearerToken } = require('../utils/jwt');

async function acesso(req, res, next) {

  try {
    const token = extractBearerToken(req.headers);

    if (!token) {
      return res.status(401).json({
        mensagem: "Formato de token inválido"
      })
    }

    const verificaToken = await verificarToken(token);

    if (!verificaToken) {
      return res.status(401).json({
        mensagem: "Token inválido ou expirado"
      })
    }

    const role = verificaToken.role_user;

    if (role != "user" && role != "admin") {
      return res.status(403).json({
        mensagem: "Acesso negado"
      })
    }

    next();
  } catch (error) {
    console.error("Erro verificar autenticação");
    return res.status(500).json({
      mensagem: "Erro interno ao verificar autenticação"
    })
  }



}

module.exports = {
  acesso,
}