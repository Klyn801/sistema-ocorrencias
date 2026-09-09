from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "sistema-ocorrencias-chave-secreta-2026"
ALGORITHM = "HS256"

security = HTTPBearer()

from backend.schemas import Ocorrencia, Usuario, Login
from backend.database import engine, Base, SessionLocal
import backend.models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Gestão de Ocorrências",
    description="API para gerenciamento de ocorrências de segurança",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def obter_banco():
    banco = SessionLocal()

    try:
        yield banco
    finally:
        banco.close()

def verificar_token(
    credenciais: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        payload = jwt.decode(
            credenciais.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expirado."
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido."
        )
        
    try:
        payload = jwt.decode(
            credenciais.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expirado."
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido."
        )


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
        status=ocorrencia.status,
        responsavel=ocorrencia.responsavel 
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
    banco: Session = Depends(obter_banco),
    usuario_logado: dict = Depends(verificar_token)
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
    banco: Session = Depends(obter_banco),
    usuario_logado: dict = Depends(verificar_token)

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
    ocorrencia.responsavel = dados.responsavel

    banco.commit()
    banco.refresh(ocorrencia)

    return {
        "mensagem": "Ocorrência atualizada com sucesso!",
        "ocorrencia": ocorrencia
    }

@app.delete("/ocorrencias/{ocorrencia_id}")
def excluir_ocorrencia(
    ocorrencia_id: int,
    banco: Session = Depends(obter_banco),
    usuario_logado: dict = Depends(verificar_token)
):

    if usuario_logado["perfil"] != "Administrador":
        raise HTTPException(
            status_code=403,
            detail="Apenas Administradores podem excluir ocorrências."
        )

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
        "mensagem": "Ocorrência excluída com sucesso."
    }

    return {
        "mensagem": "Ocorrência excluída com sucesso!"
    }
@app.post("/usuarios")
def criar_usuario(
    usuario: Usuario,
    banco: Session = Depends(obter_banco)
):
    novo_usuario = backend.models.UsuarioDB(
        nome=usuario.nome,
        usuario=usuario.usuario,
        senha=usuario.senha,
        perfil=usuario.perfil
    )

    banco.add(novo_usuario)
    banco.commit()
    banco.refresh(novo_usuario)

    return {
        "mensagem": "Usuário criado com sucesso!",
        "id": novo_usuario.id,
        "nome": novo_usuario.nome,
        "usuario": novo_usuario.usuario,
        "perfil": novo_usuario.perfil
    }
@app.post("/login")
def fazer_login(
    usuario: Login,
    banco: Session = Depends(obter_banco)
):
    usuario_encontrado = banco.query(
        backend.models.UsuarioDB
    ).filter(
        backend.models.UsuarioDB.usuario == usuario.usuario
    ).first()

    if usuario_encontrado is None:
        return {
            "sucesso": False,
            "mensagem": "Usuário não encontrado."
        }

    if usuario_encontrado.senha != usuario.senha:
        return {
            "sucesso": False,
            "mensagem": "Senha incorreta."
        }

    token = jwt.encode(
        {
            "usuario": usuario_encontrado.usuario,
            "nome": usuario_encontrado.nome,
            "perfil": usuario_encontrado.perfil,
            "exp": datetime.utcnow() + timedelta(hours=8)
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "sucesso": True,
        "mensagem": "Login realizado com sucesso!",
        "token": token,
        "usuario": usuario_encontrado.nome,
        "perfil": usuario_encontrado.perfil
    }