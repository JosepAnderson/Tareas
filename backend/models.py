from sqlalchemy import Column, Integer, String, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base

class Alumno(Base):
    __tablename__ = "alumnos"

    id = Column(String, primary_key=True, index=True)
    dni = Column(String(8), unique=True, index=True, nullable=False)
    nombres = Column(String, nullable=False)
    apellidos = Column(String, nullable=False)
    grado = Column(String, default="4° de Secundaria")
    seccion = Column(String, default="A")
    ano_lectivo = Column(Integer, default=2026)
    tutor = Column(String, default="Lic. Martha Gómez")
    estado = Column(String, default="Activo")

    notas = relationship("Nota", back_populates="alumno", cascade="all, delete-orphan")


class Curso(Base):
    __tablename__ = "cursos"

    id = Column(String, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    area = Column(String, nullable=False)
    profesor = Column(String, nullable=False)
    creditos = Column(Integer, default=4)

    notas = relationship("Nota", back_populates="curso")


class Nota(Base):
    __tablename__ = "notas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    alumno_id = Column(String, ForeignKey("alumnos.id"), nullable=False)
    curso_id = Column(String, ForeignKey("cursos.id"), nullable=False)
    periodo = Column(String(4), nullable=False) # 'bim1', 'bim2', 'bim3', 'bim4'
    n1 = Column(Float, default=14.0)
    n2 = Column(Float, default=14.0)
    n3 = Column(Float, default=14.0)
    asistencia = Column(Integer, default=95)

    alumno = relationship("Alumno", back_populates="notas")
    curso = relationship("Curso", back_populates="notas")

    __table_args__ = (
        UniqueConstraint('alumno_id', 'curso_id', 'periodo', name='_alumno_curso_periodo_uc'),
    )
