# 🛡️ Sistema de Gestão de Ocorrências

Sistema web desenvolvido em Python para gerenciamento de ocorrências de segurança.

O projeto permite registrar, consultar, atualizar e excluir ocorrências, além de possuir autenticação de usuários, controle de acesso por perfil, dashboard e geração de relatórios.

## 🚀 Funcionalidades

- 🔐 Login de usuários
- 🔑 Autenticação utilizando JWT
- 👥 Controle de acesso por perfil
- 📝 Cadastro de ocorrências
- 📋 Listagem de ocorrências
- 🔎 Consulta de ocorrência por ID
- ✏️ Atualização de ocorrências
- 🗑️ Exclusão de ocorrências
- 📊 Dashboard com indicadores
- 📄 Geração de relatório
- 🔎 Filtro por status
- 📅 Filtro por período
- 🕐 Registro da data de criação da ocorrência
- 🗄️ Persistência de dados utilizando SQLite
- 📚 Documentação automática da API com Swagger

## 👥 Perfis de acesso

O sistema possui diferentes níveis de acesso:

### Administrador
- Visualizar ocorrências
- Cadastrar ocorrências
- Editar ocorrências
- Excluir ocorrências

### Vigilante
- Visualizar ocorrências
- Cadastrar ocorrências

O controle de acesso também é realizado no backend através da autenticação.

## 🛠️ Tecnologias utilizadas

### Backend

- Python 3
- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- Pydantic
- PyJWT

### Frontend

- HTML5
- CSS3
- JavaScript

### Ferramentas

- Visual Studio Code
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
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   ├── login.html
│   ├── login.js
│   ├── relatorio.html
│   └── relatorio.js
│
├── .gitignore
├── requirements.txt
└── README.md