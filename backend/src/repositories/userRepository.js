const pool = require('../config/database');


async function buscaUsuarioPorEmail(email_user){

    const buscaUsuarioPorEmailQuery = 'SELECT EXISTS (SELECT 1 FROM users WHERE email_user = ?) AS email_existe';

    

}

// async function buscarUsuarios() {
//   const verifyAdminQuery = "SELECT COUNT(*) AS count FROM users";

//   const verifyAdmin = await pool.query(verifyAdminQuery);

//   return verifyAdmin[0][0].count;

// }


module.exports = {

};