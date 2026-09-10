const API_URL = "https://sistema-ocorrencias-api-7xip.onrender.com";

const listaRelatorio =
    document.getElementById("listaRelatorio");

const dataRelatorio =
    document.getElementById("dataRelatorio");

const filtroStatusRelatorio =
    document.getElementById("filtroStatusRelatorio");

const dataInicial =
    document.getElementById("dataInicial");

const dataFinal =
    document.getElementById("dataFinal");

const totalRelatorio =
    document.getElementById("totalRelatorio");

const abertasRelatorio =
    document.getElementById("abertasRelatorio");

const analiseRelatorio =
    document.getElementById("analiseRelatorio");

const resolvidasRelatorio =
    document.getElementById("resolvidasRelatorio");


const usuarioLogado =
    localStorage.getItem("usuario");

const perfilUsuario =
    localStorage.getItem("perfil");

    const token =
    localStorage.getItem("token");

const usuarioRelatorio =
    document.getElementById("usuarioRelatorio");

    const assinaturaUsuario =
    document.getElementById("assinaturaUsuario");

const perfilRelatorio =
    document.getElementById("perfilRelatorio");

usuarioRelatorio.textContent =
    usuarioLogado || "Não informado";

    assinaturaUsuario.textContent =
    usuarioLogado || "Não informado";

perfilRelatorio.textContent =
    perfilUsuario || "Não informado";

if (!usuarioLogado) {
    window.location.href = "login.html";
}

dataRelatorio.textContent =
    new Date().toLocaleString("pt-BR");


async function carregarRelatorio() {

    try {

        const resposta =
    await fetch(`${API_URL}/ocorrencias`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

if (!resposta.ok) {
    throw new Error("Erro ao buscar ocorrências");
}

const ocorrencias =
    await resposta.json();


        // =========================
        // FILTROS
        // =========================

        const statusSelecionado =
            filtroStatusRelatorio.value;

        const inicio =
            dataInicial.value;

        const fim =
            dataFinal.value;


        const ocorrenciasFiltradas =
            ocorrencias.filter((ocorrencia) => {

                // Filtro de status
                const correspondeStatus =
                    statusSelecionado === "" ||
                    ocorrencia.status === statusSelecionado;


                // Data da ocorrência
                let correspondeData = true;

                if (ocorrencia.data_criacao) {

                    const dataOcorrencia =
                        new Date(ocorrencia.data_criacao);

                    if (inicio) {

                        const dataInicio =
                            new Date(inicio + "T00:00:00");

                        if (dataOcorrencia < dataInicio) {
                            correspondeData = false;
                        }
                    }

                    if (fim) {

                        const dataFim =
                            new Date(fim + "T23:59:59");

                        if (dataOcorrencia > dataFim) {
                            correspondeData = false;
                        }
                    }
                }

                return (
                    correspondeStatus &&
                    correspondeData
                );
            });


        // =========================
        // RESUMO
        // =========================

        totalRelatorio.textContent =
            ocorrenciasFiltradas.length;


        abertasRelatorio.textContent =
            ocorrenciasFiltradas.filter(
                ocorrencia =>
                    ocorrencia.status === "Aberta"
            ).length;


        analiseRelatorio.textContent =
            ocorrenciasFiltradas.filter(
                ocorrencia =>
                    ocorrencia.status === "Em análise"
            ).length;


        resolvidasRelatorio.textContent =
            ocorrenciasFiltradas.filter(
                ocorrencia =>
                    ocorrencia.status === "Resolvida"
            ).length;


        // =========================
        // TABELA
        // =========================

        if (ocorrenciasFiltradas.length === 0) {

            listaRelatorio.innerHTML =
                "<p>Nenhuma ocorrência encontrada.</p>";

            return;
        }


        let tabela = `

            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Local</th>
                        <th>Descrição</th>
                        <th>Responsável</th>
                        <th>Status</th>
                        <th>Data</th>
                    </tr>

                </thead>

                <tbody>
        `;


        ocorrenciasFiltradas.forEach(
            (ocorrencia) => {

                const data =
                    ocorrencia.data_criacao
                        ? new Date(
                            ocorrencia.data_criacao
                        ).toLocaleString("pt-BR")
                        : "Não informado";


                tabela += `

                    <tr>

                        <td>${ocorrencia.id}</td>

                        <td>${ocorrencia.tipo}</td>

                        <td>${ocorrencia.local}</td>

                        <td>${ocorrencia.descricao}</td>

                        <td>
                            ${ocorrencia.responsavel || "Não informado"}
                        </td>

                        <td>${ocorrencia.status}</td>

                        <td>${data}</td>

                    </tr>

                `;
            }
        );


        tabela += `

                </tbody>

            </table>
        `;


        listaRelatorio.innerHTML =
            tabela;


    } catch (erro) {

        console.error(erro);

        listaRelatorio.innerHTML =
            "<p>Não foi possível carregar as ocorrências.</p>";
    }
}


// Atualizar quando alterar o status
filtroStatusRelatorio.addEventListener(
    "change",
    carregarRelatorio
);


// Atualizar quando alterar a data inicial
dataInicial.addEventListener(
    "change",
    carregarRelatorio
);


// Atualizar quando alterar a data final
dataFinal.addEventListener(
    "change",
    carregarRelatorio
);


carregarRelatorio();

function limparFiltros() {

    filtroStatusRelatorio.value = "";

    dataInicial.value = "";

    dataFinal.value = "";

    carregarRelatorio();
}