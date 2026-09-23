const jwt = require('jsonwebtoken');

function gerarToken(payload) {

  try {
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '5h'
      }
    );

    return token;
  }catch(error){
    console.error('Erro ao gerar token: ', error);
  }

}

function verificarToken(token){

  try{

    const decoded = jwt.verify(token, JWT_SECRET);

    return decoded;

  }catch(error){
    console.error('Token inválido ou expirado', error);
    return null
  }

}

module.exports = {
  gerarToken,
  verificarToken,
}