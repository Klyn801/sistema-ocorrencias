const usuarioLogado = localStorage.getItem("usuario");
const perfilUsuario = localStorage.getItem("perfil");
const token = localStorage.getItem("token");

if (!usuarioLogado) {
    window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", () => {

    const nomeUsuario = document.getElementById("nomeUsuario");

    if (nomeUsuario) {
        nomeUsuario.textContent = `👤 ${usuarioLogado}`;
    }

});
const API_URL = "https://sistema-ocorrencias-api-7xip.onrender.com";

const form = document.getElementById("formOcorrencia");
const lista = document.getElementById("listaOcorrencias");
const campoPesquisa = document.getElementById("pesquisa");
const filtroStatus = document.getElementById("filtroStatus");

async function carregarOcorrencias() {
    try {
        const resposta = await fetch(`${API_URL}/ocorrencias`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

        if (!resposta.ok) {
            throw new Error("Erro ao buscar ocorrências");
        }

        const ocorrencias = await resposta.json();
        atualizarGrafico(ocorrencias);
        const termoPesquisa = campoPesquisa.value.trim().toLowerCase();
        const statusSelecionado = filtroStatus.value;
        const ocorrenciasFiltradas = ocorrencias.filter((ocorrencia) => {

    const tipo = (ocorrencia.tipo || "").toLowerCase();
    const local = (ocorrencia.local || "").toLowerCase();
    const descricao = (ocorrencia.descricao || "").toLowerCase();
    const responsavel = (ocorrencia.responsavel || "").toLowerCase();

   const correspondePesquisa =
    tipo.includes(termoPesquisa) ||
    local.includes(termoPesquisa) ||
    descricao.includes(termoPesquisa) ||
    responsavel.includes(termoPesquisa);

const correspondeStatus =
    statusSelecionado === "" ||
    ocorrencia.status === statusSelecionado;

return correspondePesquisa && correspondeStatus;
});
        lista.innerHTML = "";

        let abertas = 0;
        let analise = 0;
        let resolvidas = 0;

        if (ocorrenciasFiltradas.length === 0) {
            lista.innerHTML =
                "<p>Nenhuma ocorrência cadastrada.</p>";
        }

        ocorrenciasFiltradas.forEach((ocorrencia) => {

            if (ocorrencia.status === "Aberta") {
                abertas++;
            } else if (ocorrencia.status === "Em análise") {
                analise++;
            } else if (ocorrencia.status === "Resolvida") {
                resolvidas++;
            }
let botoes = "";

if (perfilUsuario === "Administrador") {
    botoes = `
        <button onclick="editarOcorrencia(${ocorrencia.id})">
            ✏️ Editar
        </button>

        <button onclick="excluirOcorrencia(${ocorrencia.id})">
            🗑️ Excluir
        </button>
    `;
}

else if (perfilUsuario === "Supervisor") {
    botoes = `
        <button onclick="editarOcorrencia(${ocorrencia.id})">
            ✏️ Editar
        </button>
    `;
}
            const elemento = document.createElement("div");

            elemento.className = "ocorrencia";

            elemento.innerHTML = `
                <h3>${ocorrencia.tipo}</h3>

                <p>
                    <strong>Local:</strong>
                    ${ocorrencia.local}
                </p>

                <p>
                    <strong>Descrição:</strong>
                    ${ocorrencia.descricao}
                </p>

                <p>
                    <strong>Responsável:</strong>
                    ${ocorrencia.responsavel || "Não informado"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${ocorrencia.status}
                </p>
<p>
    <strong>Registrado em:</strong>
    ${ocorrencia.data_criacao
        ? new Date(ocorrencia.data_criacao).toLocaleString("pt-BR")
        : "Não informado"}
</p>
                <p>
                    <strong>ID:</strong>
                    ${ocorrencia.id}
                </p>

               ${botoes}
            `;

            lista.appendChild(elemento);
        });

        document.getElementById("total").textContent =
            ocorrencias.length;

        document.getElementById("abertas").textContent =
            abertas;

        document.getElementById("analise").textContent =
            analise;

        document.getElementById("resolvidas").textContent =
            resolvidas;

            const percentualResolvidas =
    ocorrencias.length > 0
        ? (resolvidas / ocorrencias.length) * 100
        : 0;

document.getElementById("percentualResolvidas").textContent =
    `${percentualResolvidas.toFixed(0)}%`;

    } catch (erro) {

        console.error(erro);

        lista.innerHTML =
            "<p>Não foi possível conectar com a API.</p>";
    }
}


form.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const dados = {
        tipo: document.getElementById("tipo").value,
        descricao: document.getElementById("descricao").value,
        local: document.getElementById("local").value,
        responsavel: document.getElementById("responsavel").value,
        status: document.getElementById("status").value
    };

    try {

        const resposta = await fetch(`${API_URL}/ocorrencias`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar ocorrência");
        }

        alert("Ocorrência registrada com sucesso!");

        form.reset();

        carregarOcorrencias();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao registrar ocorrência.");
    }
});


async function excluirOcorrencia(id) {

    const confirmar = confirm(
        `Deseja realmente excluir a ocorrência ${id}?`
    );

    if (!confirmar) {
        return;
    }

    try {

        const resposta = await fetch(
    `${API_URL}/ocorrencias/${id}`,
    {
        method: "DELETE",

        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
);

if (!resposta.ok) {
    throw new Error("Erro ao excluir ocorrência");
}
        alert("Ocorrência excluída com sucesso!");

        carregarOcorrencias();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao excluir ocorrência.");
    }
}


async function editarOcorrencia(id) {

    try {

        const respostaBusca = await fetch(
            `${API_URL}/ocorrencias/${id}`
        );

        if (!respostaBusca.ok) {
            throw new Error("Erro ao buscar ocorrência");
        }

        const ocorrencia = await respostaBusca.json();

        const tipo = prompt(
            "Digite o novo tipo da ocorrência:",
            ocorrencia.tipo
        );

        if (tipo === null) {
            return;
        }

        const local = prompt(
            "Digite o novo local:",
            ocorrencia.local
        );

        if (local === null) {
            return;
        }

        const descricao = prompt(
            "Digite a nova descrição:",
            ocorrencia.descricao
        );

        if (descricao === null) {
            return;
        }

        const responsavel = prompt(
            "Digite o responsável pela ocorrência:",
            ocorrencia.responsavel || ""
        );

        if (responsavel === null) {
            return;
        }

        const status = prompt(
            "Digite o novo status: Aberta, Em análise ou Resolvida",
            ocorrencia.status
        );

        if (status === null) {
            return;
        }

        const dados = {
            tipo: tipo,
            local: local,
            descricao: descricao,
            responsavel: responsavel,
            status: status
        };

        const resposta = await fetch(
            `${API_URL}/ocorrencias/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify(dados)
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao editar ocorrência");
        }

        alert("Ocorrência atualizada com sucesso!");

        carregarOcorrencias();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao editar ocorrência.");
    }
}

campoPesquisa.addEventListener("input", () => {
    carregarOcorrencias();
});

filtroStatus.addEventListener("change", () => {
    carregarOcorrencias();
});

function sairSistema() {

    const confirmar = confirm(
        "Deseja realmente sair do sistema?"
    );

    if (confirmar) {
        localStorage.removeItem("usuario");
        localStorage.removeItem("perfil");
        localStorage.removeItem("token");

        window.location.href = "login.html";
    }
}
// =========================
// GRÁFICO DO DASHBOARD
// =========================

function atualizarGrafico(ocorrencias) {

    const abertas = ocorrencias.filter(
        ocorrencia => ocorrencia.status === "Aberta"
    ).length;

    const analise = ocorrencias.filter(
        ocorrencia => ocorrencia.status === "Em análise"
    ).length;

    const resolvidas = ocorrencias.filter(
        ocorrencia => ocorrencia.status === "Resolvida"
    ).length;

    const total = ocorrencias.length;


    // Mostrar os números

    document.getElementById("numeroAbertas").textContent =
        abertas;

    document.getElementById("numeroAnalise").textContent =
        analise;

    document.getElementById("numeroResolvidas").textContent =
        resolvidas;


    // Calcular porcentagens

    const porcentagemAbertas =
        total > 0 ? (abertas / total) * 100 : 0;

    const porcentagemAnalise =
        total > 0 ? (analise / total) * 100 : 0;

    const porcentagemResolvidas =
        total > 0 ? (resolvidas / total) * 100 : 0;


    // Alterar tamanho das barras

    document.getElementById("barraAbertas").style.width =
        `${porcentagemAbertas}%`;

    document.getElementById("barraAnalise").style.width =
        `${porcentagemAnalise}%`;

    document.getElementById("barraResolvidas").style.width =
        `${porcentagemResolvidas}%`;
}


carregarOcorrencias();