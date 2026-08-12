const prisma = require("../data/prisma");
const bcrypt = require("bcryptjs");


const cadastrar = async (req, res) => {
    try {

        const {
            nome,
            email,
            senha
        } = req.body;


        const senhaCriptografada =
            await bcrypt.hash(senha, 10);


        const usuario = await prisma.usuarios.create({
            data: {
                nome: nome,
                email: email,
                senha: senhaCriptografada
            }
        });


        res.status(201).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};


const login = async (req, res) => {
    try {

        const {
            email,
            senha
        } = req.body;


        const usuario = await prisma.usuarios.findUnique({
            where: {
                email: email
            }
        });


        if (!usuario) {
            return res.status(400).json({
                erro: "Email ou senha inválidos"
            });
        }


        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );


        if (!senhaCorreta) {
            return res.status(400).json({
                erro: "Email ou senha inválidos"
            });
        }


        res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            fotoPerfil: usuario.fotoPerfil
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};


const buscarPerfil = async (req, res) => {
    try {

        const usuario = await prisma.usuarios.findUnique({
            where: {
                id: req.usuarioId
            }
        });


        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            });
        }


        res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            fotoPerfil: usuario.fotoPerfil,
            criadoEm: usuario.criadoEm
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};


const atualizarPerfil = async (req, res) => {
    try {

        const {
            nome,
            email
        } = req.body;


        const dados = {
            nome: nome,
            email: email
        };


        if (req.file) {
            dados.fotoPerfil =
                `uploads/perfil/${req.file.filename}`;
        }


        const usuario = await prisma.usuarios.update({
            where: {
                id: req.usuarioId
            },

            data: dados
        });


        res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            fotoPerfil: usuario.fotoPerfil
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};


module.exports = {
    cadastrar,
    login,
    buscarPerfil,
    atualizarPerfil
};