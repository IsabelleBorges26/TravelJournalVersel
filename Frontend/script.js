const API = "http://localhost:3000";

const USUARIOS_URL = `${API}/usuarios`;
const VIAGENS_URL = `${API}/viagens`;
const FOTOS_URL = `${API}/fotos`;

let modoCadastro = false;
let usuarioLogado = null;
let viagemAtual = null;


function cabecalhos() {
    return {
        "usuario-id": usuarioLogado ? usuarioLogado.id : ""
    };
}


function textoStatus(status) {
    const textos = {
        planejada: "Planejada",
        em_andamento: "Em andamento",
        concluida: "Concluída"
    };

    return textos[status] || status;
}


function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR");
}


function alternarModoAuth() {
    modoCadastro = !modoCadastro;
    atualizarTelaAuth();
}


function atualizarTelaAuth() {
    document.getElementById("tituloAuth").textContent =
        modoCadastro ? "Criar conta" : "Entrar";

    document.getElementById("nomeCadastro").style.display =
        modoCadastro ? "block" : "none";

    document.getElementById("btnAuth").textContent =
        modoCadastro ? "Cadastrar" : "Entrar";

    document.getElementById("linkAlternar").textContent =
        modoCadastro
            ? "Já tem conta? Entrar"
            : "Não tem conta? Cadastre-se";
}


async function fazerAuth() {
    const email = document.getElementById("emailAuth").value;
    const senha = document.getElementById("senhaAuth").value;
    const erro = document.getElementById("erroAuth");

    erro.style.display = "none";


    if (modoCadastro) {

        const nome = document.getElementById("nomeCadastro").value;

        const resposta = await fetch(`${USUARIOS_URL}/cadastrar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                email,
                senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            erro.textContent = dados.erro;
            erro.style.display = "block";
            return;
        }

        modoCadastro = false;
        atualizarTelaAuth();

        return;
    }


    const resposta = await fetch(`${USUARIOS_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            senha
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        erro.textContent = dados.erro;
        erro.style.display = "block";
        return;
    }

    usuarioLogado = dados;

    localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioLogado)
    );

    mostrarApp();
}


function mostrarApp() {
    document.getElementById("autenticacao").style.display = "none";
    document.getElementById("app").style.display = "block";

    document.getElementById("nomeUsuario").textContent =
        "Olá, " + usuarioLogado.nome;

    carregarViagens();
}


function sair() {
    usuarioLogado = null;

    localStorage.removeItem("usuarioLogado");

    document.getElementById("app").style.display = "none";
    document.getElementById("detalhesViagem").style.display = "none";
    document.getElementById("autenticacao").style.display = "block";
}


document
    .getElementById("linkAlternar")
    .addEventListener("click", alternarModoAuth);

document
    .getElementById("btnAuth")
    .addEventListener("click", fazerAuth);

document
    .getElementById("btnSair")
    .addEventListener("click", sair);


async function carregarViagens() {

    const busca = document.getElementById("busca").value;
    const status = document.getElementById("filtroStatus").value;

    const parametros = new URLSearchParams();

    if (busca) {
        parametros.append("busca", busca);
    }

    if (status) {
        parametros.append("status", status);
    }


    const resposta = await fetch(
        `${VIAGENS_URL}/listar?${parametros}`,
        {
            headers: cabecalhos()
        }
    );

    const viagens = await resposta.json();

    const lista = document.getElementById("listaViagens");

    lista.innerHTML = "";


    viagens.forEach(function (viagem) {

        let imagem = "";

        if (viagem.fotos.length > 0) {
            imagem = `${API}/${viagem.fotos[0].imagem}`;
        }


        const div = document.createElement("div");

        div.classList.add("viagem");


        div.innerHTML = `
            ${imagem ? `<img src="${imagem}" alt="${viagem.titulo}">` : ""}

            <div class="viagem-body">

                <div class="viagem-local">
                    ${viagem.cidade}, ${viagem.pais}
                </div>

                <h3>${viagem.titulo}</h3>

                <span class="viagem-status">
                    ${textoStatus(viagem.status)}
                </span>

                <button onclick="abrirDetalhes(${viagem.id})">
                    Ver detalhes
                </button>

            </div>
        `;


        lista.appendChild(div);
    });
}


document
    .getElementById("btnBuscar")
    .addEventListener("click", carregarViagens);


function abrirModalNovaViagem() {

    document.getElementById("tituloModalViagem").textContent =
        "Nova viagem";

    document.getElementById("formViagem").reset();

    document.getElementById("viagemId").value = "";

    document.getElementById("modalViagem").style.display =
        "block";
}


function fecharModalViagem() {
    document.getElementById("modalViagem").style.display =
        "none";
}


document
    .getElementById("btnNovaViagem")
    .addEventListener("click", abrirModalNovaViagem);

document
    .getElementById("fecharModalViagem")
    .addEventListener("click", fecharModalViagem);


document
    .getElementById("formViagem")
    .addEventListener("submit", async function (evento) {

        evento.preventDefault();

        const id = document.getElementById("viagemId").value;


        const dados = {
            titulo: document.getElementById("titulo").value,
            pais: document.getElementById("pais").value,
            cidade: document.getElementById("cidade").value,
            descricao: document.getElementById("descricao").value,
            dataInicio: document.getElementById("dataInicio").value,
            dataFim: document.getElementById("dataFim").value,
            custo: document.getElementById("custo").value,
            avaliacao: document.getElementById("avaliacao").value,
            status: document.getElementById("status").value
        };


        const url = id
            ? `${VIAGENS_URL}/atualizar/${id}`
            : `${VIAGENS_URL}/cadastrar`;

        const metodo = id ? "PUT" : "POST";


        await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json",
                ...cabecalhos()
            },
            body: JSON.stringify(dados)
        });


        fecharModalViagem();
        carregarViagens();
    });


async function abrirDetalhes(id) {

    viagemAtual = id;


    const resposta = await fetch(
        `${VIAGENS_URL}/buscar/${id}`,
        {
            headers: cabecalhos()
        }
    );


    const viagem = await resposta.json();

    window.viagemEmEdicao = viagem;


    document.getElementById("detalheTitulo").textContent =
        viagem.titulo;

    document.getElementById("detalheLocal").textContent =
        `${viagem.cidade}, ${viagem.pais}`;

    document.getElementById("detalheDatas").textContent =
        `${formatarData(viagem.dataInicio)} até ${formatarData(viagem.dataFim)}`;

    document.getElementById("detalheCusto").textContent =
        viagem.custo ? `Custo: R$ ${viagem.custo}` : "";

    document.getElementById("detalheAvaliacao").textContent =
        viagem.avaliacao
            ? `Avaliação: ${viagem.avaliacao}/5`
            : "";

    document.getElementById("detalheStatus").textContent =
        `Status: ${textoStatus(viagem.status)}`;

    document.getElementById("detalheDescricao").textContent =
        viagem.descricao || "";


    const galeria = document.getElementById("galeriaFotos");

    galeria.innerHTML = "";


    viagem.fotos.forEach(function (foto) {

        const imagem = document.createElement("img");

        imagem.src = `${API}/${foto.imagem}`;
        imagem.alt = "Foto da viagem";

        galeria.appendChild(imagem);
    });


    document.getElementById("app").style.display = "none";

    document.getElementById("detalhesViagem").style.display =
        "block";
}


document
    .getElementById("fecharDetalhes")
    .addEventListener("click", function () {

        document.getElementById("detalhesViagem").style.display =
            "none";

        document.getElementById("app").style.display =
            "block";
    });


document
    .getElementById("btnEditarViagem")
    .addEventListener("click", function () {

        const viagem = window.viagemEmEdicao;


        document.getElementById("tituloModalViagem").textContent =
            "Editar viagem";

        document.getElementById("viagemId").value =
            viagem.id;

        document.getElementById("titulo").value =
            viagem.titulo;

        document.getElementById("pais").value =
            viagem.pais;

        document.getElementById("cidade").value =
            viagem.cidade;

        document.getElementById("descricao").value =
            viagem.descricao || "";

        document.getElementById("dataInicio").value =
            viagem.dataInicio.substring(0, 10);

        document.getElementById("dataFim").value =
            viagem.dataFim.substring(0, 10);

        document.getElementById("custo").value =
            viagem.custo || "";

        document.getElementById("avaliacao").value =
            viagem.avaliacao || "";

        document.getElementById("status").value =
            viagem.status;


        document.getElementById("modalViagem").style.display =
            "block";
    });


document
    .getElementById("btnExcluirViagem")
    .addEventListener("click", async function () {

        const confirmar = confirm(
            "Tem certeza que deseja excluir esta viagem?"
        );

        if (!confirmar) {
            return;
        }


        await fetch(
            `${VIAGENS_URL}/excluir/${viagemAtual}`,
            {
                method: "DELETE",
                headers: cabecalhos()
            }
        );


        document.getElementById("detalhesViagem").style.display =
            "none";

        document.getElementById("app").style.display =
            "block";

        carregarViagens();
    });


document
    .getElementById("btnAdicionarFotos")
    .addEventListener("click", async function () {

        const arquivos =
            document.getElementById("inputFotos").files;


        if (arquivos.length === 0) {
            alert("Selecione ao menos uma foto");
            return;
        }


        const formData = new FormData();


        for (let i = 0; i < arquivos.length; i++) {
            formData.append("fotos", arquivos[i]);
        }


        await fetch(
            `${FOTOS_URL}/cadastrar/${viagemAtual}`,
            {
                method: "POST",
                headers: cabecalhos(),
                body: formData
            }
        );


        abrirDetalhes(viagemAtual);
    });


function abrirPerfil() {

    document.getElementById("perfilNome").value =
        usuarioLogado.nome;

    document.getElementById("perfilEmail").value =
        usuarioLogado.email;

    document.getElementById("modalPerfil").style.display =
        "block";
}


document
    .getElementById("btnPerfil")
    .addEventListener("click", abrirPerfil);


document
    .getElementById("fecharModalPerfil")
    .addEventListener("click", function () {

        document.getElementById("modalPerfil").style.display =
            "none";
    });


document
    .getElementById("formPerfil")
    .addEventListener("submit", async function (evento) {

        evento.preventDefault();


        const formData = new FormData();

        formData.append(
            "nome",
            document.getElementById("perfilNome").value
        );

        formData.append(
            "email",
            document.getElementById("perfilEmail").value
        );


        const arquivo =
            document.getElementById("perfilFoto").files[0];


        if (arquivo) {
            formData.append("foto", arquivo);
        }


        const resposta = await fetch(
            `${USUARIOS_URL}/perfil`,
            {
                method: "PUT",
                headers: cabecalhos(),
                body: formData
            }
        );


        const dados = await resposta.json();

        usuarioLogado = dados;


        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuarioLogado)
        );


        document.getElementById("nomeUsuario").textContent =
            "Olá, " + usuarioLogado.nome;


        document.getElementById("modalPerfil").style.display =
            "none";
    });


const usuarioSalvo =
    localStorage.getItem("usuarioLogado");


if (usuarioSalvo) {

    usuarioLogado =
        JSON.parse(usuarioSalvo);

    mostrarApp();
}