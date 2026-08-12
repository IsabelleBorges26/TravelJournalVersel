const express = require("express");

const router = express.Router();


const verificarLogin = require("../middleware/auth");


const {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
} = require("../controllers/viagens.controller");


router.use(verificarLogin);


router.post("/cadastrar", cadastrar);

router.get("/listar", listar);

router.get("/buscar/:id", buscar);

router.put("/atualizar/:id", atualizar);

router.delete("/excluir/:id", excluir);


module.exports = router;