const multer = require("multer");
const path = require("path");
const fs = require("fs");

const definirDestino = (req, file, callback) => {
  const pastaDestino = path.join(__dirname, "..", "..", "uploads", "viagens");

  if (!fs.existsSync(pastaDestino)) {
    fs.mkdirSync(pastaDestino, { recursive: true });
  }

  callback(null, pastaDestino);
};

const validarNomeArquivo = (req, file, callback) => {
  const nomeFinal = Date.now() + "-" + file.originalname;
  callback(null, nomeFinal);
};

const filtrarExtensao = (req, file, callback) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    callback(null, true);
  } else {
    callback(new Error("Apenas JPEG, JPG ou PNG"));
  }
};

const armazenamento = multer.diskStorage({
  destination: definirDestino,
  filename: validarNomeArquivo,
});

const upload = (req, res, next) => {
  const filemulter = multer({
    storage: armazenamento,
    fileFilter: filtrarExtensao,
  });

  filemulter.array("fotos", 10)(req, res, function (erro) {
    if (erro) {
      return res.status(400).json({ erro: erro.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ erro: "Sem arquivos" });
    }

    next();
  });
};

module.exports = upload;