from pydantic import BaseModel


class Ocorrencia(BaseModel):
    tipo: str
    descricao: str
    local: str
    status: str