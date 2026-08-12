const express = require("express");
const router = express.Router();

const verificarLogin = require("../middleware/auth");
const upload = require("../middleware/uploadImagem");
const { cadastrar, buscar, excluir } = require("../controllers/fotos.controller");

router.use(verificarLogin);

router.post("/cadastrar/:id", upload, cadastrar);
router.get("/buscar/:id", buscar);
router.delete("/excluir/:id", excluir);

module.exports = router;