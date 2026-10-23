from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class NotaPeriodoSchema(BaseModel):
    n1: float = Field(ge=0, le=20)
    n2: float = Field(ge=0, le=20)
    n3: float = Field(ge=0, le=20)
    asistencia: int = Field(ge=0, le=100)

class CursoSchema(BaseModel):
    id: str
    nombre: str
    area: str
    profesor: str
    creditos: int
    notasPorPeriodo: Dict[str, NotaPeriodoSchema]

class AlumnoSchema(BaseModel):
    id: str
    dni: str
    nombres: str
    apellidos: str
    grado: str
    seccion: str
    añoLectivo: int
    tutor: str
    estado: str
    cursos: List[CursoSchema]

    class Config:
        from_attributes = True

class AlumnoCreateSchema(BaseModel):
    dni: str = Field(min_length=8, max_length=8)
    nombres: str
    apellidos: str
    grado: str = "4° de Secundaria"
    seccion: str = "A"
    tutor: str = "Lic. Martha Gómez"

class AlumnoCreateResponse(BaseModel):
    message: str
    alumno: AlumnoSchema

class CalificacionUpdateSchema(BaseModel):
    alumno_id: str
    curso_id: str
    periodo: str # 'bim1', 'bim2', 'bim3', 'bim4'
    n1: float = Field(ge=0, le=20)
    n2: float = Field(ge=0, le=20)
    n3: float = Field(ge=0, le=20)
    asistencia: int = Field(ge=0, le=100)

class LoginRequest(BaseModel):
    usuario: str
    clave: str

class LoginResponse(BaseModel):
    autenticado: bool
    docente: Optional[str] = None
    mensaje: str
