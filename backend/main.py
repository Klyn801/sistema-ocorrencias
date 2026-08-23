from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from backend.schemas import Ocorrencia
from backend.database import engine, Base, SessionLocal
import backend.models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Gestão de Ocorrências",
    description="API para gerenciamento de ocorrências de segurança",
    version="1.0.0"
)


def obter_banco():
    banco = SessionLocal()

    try:
        yield banco
    finally:
        banco.close()


@app.get("/")
def inicio():
    return {
        "mensagem": "Sistema de Gestão de Ocorrências funcionando!"
    }


@app.post("/ocorrencias")
def criar_ocorrencia(
    ocorrencia: Ocorrencia,
    banco: Session = Depends(obter_banco)
):
    nova_ocorrencia = backend.models.OcorrenciaDB(
        tipo=ocorrencia.tipo,
        descricao=ocorrencia.descricao,
        local=ocorrencia.local,
        status=ocorrencia.status
    )

    banco.add(nova_ocorrencia)
    banco.commit()
    banco.refresh(nova_ocorrencia)

    return {
        "mensagem": "Ocorrência registrada com sucesso!",
        "id": nova_ocorrencia.id,
        "ocorrencia": {
            "tipo": nova_ocorrencia.tipo,
            "descricao": nova_ocorrencia.descricao,
            "local": nova_ocorrencia.local,
            "status": nova_ocorrencia.status
        }
    }
@app.get("/ocorrencias")
def listar_ocorrencias(
    banco: Session = Depends(obter_banco)
):
    ocorrencias = banco.query(
        backend.models.OcorrenciaDB
    ).all()

    return ocorrencias
@app.get("/ocorrencias/{ocorrencia_id}")
def buscar_ocorrencia(
    ocorrencia_id: int,
    banco: Session = Depends(obter_banco)
):
    ocorrencia = banco.query(
        backend.models.OcorrenciaDB
    ).filter(
        backend.models.OcorrenciaDB.id == ocorrencia_id
    ).first()

    if ocorrencia is None:
        return {
            "mensagem": "Ocorrência não encontrada."
        }

    return ocorrencia
@app.put("/ocorrencias/{ocorrencia_id}")
def atualizar_ocorrencia(
    ocorrencia_id: int,
    dados: Ocorrencia,
    banco: Session = Depends(obter_banco)
):
    ocorrencia = banco.query(
        backend.models.OcorrenciaDB
    ).filter(
        backend.models.OcorrenciaDB.id == ocorrencia_id
    ).first()

    if ocorrencia is None:
        return {
            "mensagem": "Ocorrência não encontrada."
        }

    ocorrencia.tipo = dados.tipo
    ocorrencia.descricao = dados.descricao
    ocorrencia.local = dados.local
    ocorrencia.status = dados.status

    banco.commit()
    banco.refresh(ocorrencia)

    return {
        "mensagem": "Ocorrência atualizada com sucesso!",
        "ocorrencia": ocorrencia
    }
@app.delete("/ocorrencias/{ocorrencia_id}")
def excluir_ocorrencia(
    ocorrencia_id: int,
    banco: Session = Depends(obter_banco)
):
    ocorrencia = banco.query(
        backend.models.OcorrenciaDB
    ).filter(
        backend.models.OcorrenciaDB.id == ocorrencia_id
    ).first()

    if ocorrencia is None:
        return {
            "mensagem": "Ocorrência não encontrada."
        }

    banco.delete(ocorrencia)
    banco.commit()

    return {
        "mensagem": "Ocorrência excluída com sucesso!"
    }