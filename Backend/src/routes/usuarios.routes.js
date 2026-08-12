const express = require("express");

const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const verificarLogin = require("../middleware/auth");

const {
  cadastrar,
  login,
  buscarPerfil,
  atualizarPerfil
} = require("../controllers/usuarios.controller");


const armazenamento = multer.diskStorage({
  destination: (req, file, callback) => {
    const pastaDestino = path.join(__dirname, "..", "..", "uploads", "perfil");

    if (!fs.existsSync(pastaDestino)) {
      fs.mkdirSync(pastaDestino, { recursive: true });
    }

    callback(null, pastaDestino);
  },

  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  }
});


const uploadPerfil = multer({
  storage: armazenamento
});


router.post("/cadastrar", cadastrar);
router.post("/login", login);

router.get("/perfil", verificarLogin, buscarPerfil);

router.put(
  "/perfil",
  verificarLogin,
  uploadPerfil.single("foto"),
  atualizarPerfil
);


module.exports = router;