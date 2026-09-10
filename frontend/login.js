const API_URL = "https://sistema-ocorrencias-api-7xip.onrender.com";

const formLogin = document.getElementById("formLogin");
const mensagemLogin = document.getElementById("mensagemLogin");

formLogin.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    const dados = {
    usuario: usuario,
    senha: senha
};

    try {

        const resposta = await fetch(`${API_URL}/login`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {

            mensagemLogin.textContent =
                "Login realizado com sucesso!";

            localStorage.setItem(
                "usuario",
                resultado.usuario
            );

            localStorage.setItem(
                "perfil",
                resultado.perfil
            );

            localStorage.setItem(
                 "token",
                 resultado.token
            );

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } else {

            mensagemLogin.textContent =
                resultado.mensagem;
        }

    } catch (erro) {

        console.error(erro);

        mensagemLogin.textContent =
            "Erro ao conectar com o servidor.";
    }
});