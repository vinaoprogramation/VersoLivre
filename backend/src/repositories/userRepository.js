const pool = require('../config/database');


async function existeUsuario(email_user, id_user) {

    try {

        async function separaTipo(email_user, id_user) {
            if (id_user!=null) {
                const buscaUsuarioQuery = 'SELECT EXISTS (SELECT 1 FROM users WHERE id_user = ?) AS id_existe';

                const [buscaUsuario] = await pool.execute(buscaUsuarioQuery, [id_user]);
                
                return buscaUsuario[0].id_existe === 1;
            }

            else if (!id_user && email_user!=null) {
                const buscaUsuarioQuery = 'SELECT EXISTS (SELECT 1 FROM users WHERE email_user = ?) AS email_existe';

                const [buscaUsuario] = await pool.execute(buscaUsuarioQuery, [email_user]);
                
                return buscaUsuario[0].email_existe === 1;
            }
            else{
                return null;
            }

        }

        if (await separaTipo(email_user, id_user)) {
            return true;
        };

        return false;
    } catch (error) {
        console.error("Erro no banco de dados ao buscar usuário por email", error);
    }

}

async function numeroDeUsuarios(){

    try {
        
        const verificaUsuariosQuery = "SELECT CASE WHEN EXISTS (SELECT 1 FROM users) THEN 1 ELSE 0 END AS resultado";

        const [verificaUsuarios] = await pool.execute(verificaUsuariosQuery);

        if(verificaUsuarios[0].resultado === 1){
            return true;
        }

        return false;

    } catch (error) {
        console.error("Erro ao verificar a quantidade de usuários no sistema")
    }

}

async function buscaSenha(email_user, id_user) {

    try {

        if (id_user) {
            const buscaSenhaQuery = "SELECT senha_user FROM users WHERE id_user = ?";
            const [buscaSenha] = await pool.execute(buscaSenhaQuery, [id_user]);
            return buscaSenha[0];
        }
        else if (!id_user && email_user) {
            const buscaSenhaQuery = "SELECT senha_user FROM users WHERE email_user = ?";
            const [buscaSenha] = await pool.execute(buscaSenhaQuery, [email_user]);
            return buscaSenha[0].senha_user;
        }
        else {
            return null;
        }


    } catch (error) {
        console.error("Erro no banco de dados ao buscar a senha", error);
    }

}

async function buscaParaAutenticacao(email_user) {

    try {

        const buscaIdQuery = "SELECT id_user FROM users WHERE email_user = ?";
        const [buscaId] = await pool.execute(buscaIdQuery, [email_user]);

        const buscaRoleQuery = "SELECT role_user FROM users WHERE id_user = ? FOR UPDATE";
        const [buscaRole] = await pool.execute(buscaRoleQuery, [buscaId[0].id_user]);

        return {
            id: buscaId[0].id_user,
            role: buscaRole[0].role_user,
        }

    } catch (error) {
        console.error("Erro ao buscar ID do usuário", error);
    }

}



async function postaUsuario(nome_user, email_user, senha_user) {

    try {

        let role_user = "user";

        const verificaPapel = await numeroDeUsuarios();

        if(!verificaPapel){
            role_user = "admin";
        }

        const postaUsuarioQuery = "INSERT INTO users (nome_user, email_user, role_user, senha_user) VALUES (?, ?, ?, ?)";

        const [postaUsuario] = await pool.execute(postaUsuarioQuery, [nome_user, email_user, role_user, senha_user]);

        return postaUsuario.affectedRows;


    } catch (error) {
        console.error("Erro no banco de dados ao postar usuário", error);

    }

}

async function cadastraUsuario(nome_user, email_user, senha_user, role_user){

    try {

        const cadastraUsuarioQuery = "INSERT INTO users (nome_user, email_user, role_user, senha_user) VALUES (?, ?, ?, ?)";

        const [cadastraUsuario] = await pool.execute(cadastraUsuarioQuery, [nome_user, email_user, role_user, senha_user]);

        return cadastraUsuario.affectedRows;

        
    } catch (error) {
        console.error("Erro ao cadastrar usuário");
    }

}

module.exports = {
    existeUsuario,
    postaUsuario,
    cadastraUsuario,
    buscaSenha,
    buscaParaAutenticacao,
    numeroDeUsuarios,
};