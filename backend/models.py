from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from backend.database import Base


class OcorrenciaDB(Base):
    __tablename__ = "ocorrencias"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(100), nullable=False)
    descricao = Column(Text, nullable=False)
    local = Column(String(200), nullable=False)
    status = Column(String(50), nullable=False)
    responsavel = Column(String(100), nullable=True)

    data_criacao = Column(
        DateTime,
        default=datetime.now
    )


class UsuarioDB(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String(100), nullable=False)

    usuario = Column(
        String(50),
        unique=True,
        nullable=False
    )

    senha = Column(String(100), nullable=False)

    perfil = Column(
        String(50),
        nullable=False,
        default="Vigilante"
    )