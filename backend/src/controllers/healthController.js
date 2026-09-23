function health(req, res) {

  try {
    if (req) {
      return res.status(200).json({
        mensagem: 'Api Funcionando'
      })
    }
  }catch(error){
    console.error("Problema na api", error)
  }

  
}

module.exports = {
  health
};