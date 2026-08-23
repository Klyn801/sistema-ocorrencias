from sqlalchemy import Column, Integer, String, Text
from backend.database import Base


class OcorrenciaDB(Base):
    __tablename__ = "ocorrencias"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(100), nullable=False)
    descricao = Column(Text, nullable=False)
    local = Column(String(200), nullable=False)
    status = Column(String(50), nullable=False)