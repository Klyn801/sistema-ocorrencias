from pydantic import BaseModel


class Ocorrencia(BaseModel):
    tipo: str
    descricao: str
    local: str
    status: str
    responsavel: str | None = None


class Usuario(BaseModel):
    nome: str
    usuario: str
    senha: str
    perfil: str = "Vigilante"


class Login(BaseModel):
    usuario: str
    senha: str


    