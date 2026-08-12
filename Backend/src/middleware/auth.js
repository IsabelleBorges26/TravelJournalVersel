const prisma = require("../data/prisma");


const verificarLogin = async (req, res, next) => {
    try {

        const usuarioId = req.header("usuario-id");


        if (!usuarioId) {
            return res.status(401).json({
                erro: "Você precisa estar logado"
            });
        }


        const usuario = await prisma.usuarios.findUnique({
            where: {
                id: Number(usuarioId)
            }
        });


        if (!usuario) {
            return res.status(401).json({
                erro: "Usuário inválido"
            });
        }


        req.usuarioId = usuario.id;

        next();

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};


module.exports = verificarLogin;