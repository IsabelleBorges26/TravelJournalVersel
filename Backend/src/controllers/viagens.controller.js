const prisma = require("../data/prisma");


const cadastrar = async (req, res) => {
    try {

        const {
            titulo,
            pais,
            cidade,
            descricao,
            dataInicio,
            dataFim,
            custo,
            avaliacao,
            status
        } = req.body;


        const viagem = await prisma.viagens.create({
            data: {
                titulo: titulo,
                pais: pais,
                cidade: cidade,
                descricao: descricao,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim),
                custo: custo ? parseFloat(custo) : null,
                avaliacao: avaliacao ? parseInt(avaliacao) : null,
                status: status || "planejada",
                usuarioId: req.usuarioId
            }
        });


        res.status(201).json(viagem);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};


const listar = async (req, res) => {
    try {

        const { busca, status } = req.query;

        let filtro = {
            usuarioId: req.usuarioId
        };

        if (status) {
            filtro.status = status;
        }

        if (busca) {
            filtro.OR = [
                {
                    titulo: {
                        contains: busca
                    }
                },
                {
                    cidade: {
                        contains: busca
                    }
                },
                {
                    pais: {
                        contains: busca
                    }
                }
            ];
        }

        if (busca && status) {
            filtro.status = undefined;
        }

        const lista = await prisma.viagens.findMany({
            where: filtro,

            include: {
                fotos: true
            },

            orderBy: {
                dataInicio: "desc"
            }
        });

        res.status(200).json(lista);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};


const buscar = async (req, res) => {
    try {

        const id = Number(req.params.id);


        const viagem = await prisma.viagens.findFirst({
            where: {
                id: id,
                usuarioId: req.usuarioId
            },

            include: {
                fotos: true
            }
        });


        if (!viagem) {
            return res.status(404).json({
                erro: "Viagem não encontrada"
            });
        }


        res.status(200).json(viagem);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};


const atualizar = async (req, res) => {
    try {

        const id = Number(req.params.id);


        const {
            titulo,
            pais,
            cidade,
            descricao,
            dataInicio,
            dataFim,
            custo,
            avaliacao,
            status
        } = req.body;


        const viagem = await prisma.viagens.update({
            where: {
                id: id
            },

            data: {
                titulo: titulo,
                pais: pais,
                cidade: cidade,
                descricao: descricao,

                dataInicio: dataInicio
                    ? new Date(dataInicio)
                    : undefined,

                dataFim: dataFim
                    ? new Date(dataFim)
                    : undefined,

                custo: custo
                    ? parseFloat(custo)
                    : undefined,

                avaliacao: avaliacao
                    ? parseInt(avaliacao)
                    : undefined,

                status: status
            }
        });


        res.status(200).json(viagem);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};


const excluir = async (req, res) => {
    try {

        const id = Number(req.params.id);


        const viagem = await prisma.viagens.delete({
            where: {
                id: id
            }
        });


        res.status(200).json(viagem);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });

    }
};


module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};