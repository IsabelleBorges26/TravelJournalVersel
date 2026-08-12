const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {
        const viagemId = Number(req.params.id);
        const arquivos = req.files;

        if (!arquivos || arquivos.length === 0) {
            return res.status(400).json({
                erro: "Nenhuma imagem enviada"
            });
        }

        const fotosCriadas = await Promise.all(
            arquivos.map((arquivo) => {
                return prisma.fotos.create({
                    data: {
                        imagem: `uploads/viagens/${arquivo.filename}`,
                        viagemId: viagemId
                    }
                });
            })
        );

        res.status(201).json(fotosCriadas);

    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
};

const buscar = async (req, res) => {
    try {
        const viagemId = Number(req.params.id);

        const fotos = await prisma.fotos.findMany({
            where: {
                viagemId: viagemId
            }
        });

        res.status(200).json(fotos);

    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
};

const excluir = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const foto = await prisma.fotos.delete({
            where: {
                id: id
            }
        });

        res.status(200).json(foto);

    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
};

module.exports = {
    cadastrar,
    buscar,
    excluir
};