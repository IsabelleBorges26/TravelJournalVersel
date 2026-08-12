require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "..", "Frontend")));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


const usuariosRoutes = require("./src/routes/usuarios.routes");
const viagensRoutes = require("./src/routes/viagens.routes");
const fotosRoutes = require("./src/routes/fotos.routes");


app.use("/usuarios", usuariosRoutes);
app.use("/viagens", viagensRoutes);
app.use("/fotos", fotosRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});