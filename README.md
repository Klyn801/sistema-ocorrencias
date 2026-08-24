# 🛡️ Sistema de Gestão de Ocorrências

API REST desenvolvida em Python para gerenciamento de ocorrências de segurança.

O projeto permite cadastrar, consultar, atualizar e excluir ocorrências utilizando uma API desenvolvida com FastAPI e banco de dados SQLite.

## 🚀 Funcionalidades

- Cadastro de ocorrências
- Listagem de ocorrências
- Consulta de ocorrência por ID
- Atualização de ocorrências
- Exclusão de ocorrências
- Documentação automática da API com Swagger
- Persistência de dados em banco SQLite

## 🛠️ Tecnologias utilizadas

- Python 3
- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- Pydantic
- Git
- GitHub

## 📁 Estrutura do projeto

```text
sistema-ocorrencias/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   └── schemas.py
│
├── .gitignore
├── requirements.txt
└── README.md
🔗 Endpoints
Método	Endpoint	Descrição
GET	/	Verifica se a API está funcionando
POST	/ocorrencias	Cadastra uma ocorrência
GET	/ocorrencias	Lista as ocorrências
GET	/ocorrencias/{id}	Consulta uma ocorrência
PUT	/ocorrencias/{id}	Atualiza uma ocorrência
DELETE	/ocorrencias/{id}	Exclui uma ocorrência
▶️ Como executar o projeto

Clone o repositório:

git clone https://github.com/Klyn801/sistema-ocorrencias.git

Entre na pasta:

cd sistema-ocorrencias

Crie o ambiente virtual:

python -m venv venv

Ative o ambiente virtual no Windows:

venv\Scripts\activate

Instale as dependências:

pip install -r requirements.txt

Execute a API:

uvicorn backend.main:app --reload

A API ficará disponível em:

http://localhost:8000
📚 Documentação

O FastAPI disponibiliza uma documentação interativa através do Swagger:

http://localhost:8000/docs

Também é possível acessar a documentação alternativa:

http://localhost:8000/redoc
🎯 Objetivo do projeto

Este projeto foi desenvolvido como parte do meu portfólio de desenvolvimento de software, com o objetivo de demonstrar conhecimentos em:

Desenvolvimento de APIs REST
Python
FastAPI
Banco de dados
CRUD
Arquitetura de aplicações
Git e GitHub
👨‍💻 Autor

Klinger Cardoso

Projeto desenvolvido para fins de estudo e portfólio profissional.


Depois pressione:

**Ctrl + S**

### ⚠️ Não faça o Git ainda

Primeiro vamos conferir o README visualmente no próprio VS Code.

Depois de salvar, clique com o botão direito no `README.md` e procure **Open Preview**.

Se aparecer a versão formatada do README, me diga **“abriu o preview”**. Depois fazemos o commit e atualizamos o GitHub.