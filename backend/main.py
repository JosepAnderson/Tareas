from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uuid

from database import engine, Base, get_db
import models
import schemas

# Crear tablas en SQLite automáticamente si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Gestión Académica Escolar",
    description="Backend oficial en FastAPI con SQLite para control de notas, consulta por DNI y panel docente.",
    version="1.0.0"
)

# Configuración de CORS para permitir peticiones desde React (Vite: localhost:3000 o 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper para poblar datos iniciales si la base de datos está vacía
def seed_database(db: Session):
    # Verificar si ya existen cursos
    if db.query(models.Curso).count() == 0:
        cursos_base = [
            models.Curso(id="mat", nombre="Matemáticas", area="Ciencias Exactas", profesor="Mg. Carlos Paredes", creditos=5),
            models.Curso(id="cyt", nombre="Ciencias", area="Ciencias Naturales", profesor="Dr. Roberto Huamán", creditos=4),
            models.Curso(id="com", nombre="Comunicación", area="Humanidades", profesor="Lic. Martha Gómez", creditos=5),
        ]
        db.add_all(cursos_base)
        db.commit()

    # Verificar si ya existen alumnos
    if db.query(models.Alumno).count() == 0:
        alumnos_base = [
            models.Alumno(
                id="est-001",
                dni="72458912",
                nombres="Carlos Daniel",
                apellidos="Mendoza Rojas",
                grado="4° de Secundaria",
                seccion="A",
                ano_lectivo=2026,
                tutor="Lic. Martha Gómez",
                estado="Activo"
            ),
            models.Alumno(
                id="est-002",
                dni="75319842",
                nombres="Valeria Sofía",
                apellidos="Quispe Benítez",
                grado="4° de Secundaria",
                seccion="A",
                ano_lectivo=2026,
                tutor="Lic. Martha Gómez",
                estado="Activo"
            ),
            models.Alumno(
                id="est-003",
                dni="76892341",
                nombres="Mateo Alejandro",
                apellidos="Fernández Castro",
                grado="4° de Secundaria",
                seccion="A",
                ano_lectivo=2026,
                tutor="Lic. Martha Gómez",
                estado="Activo"
            ),
        ]
        db.add_all(alumnos_base)
        db.commit()

        # Notas predeterminadas para los 3 alumnos en los 4 bimestres
        bimestres = ["bim1", "bim2", "bim3", "bim4"]
        cursos_ids = ["mat", "cyt", "com"]

        for alumno in alumnos_base:
            for curso_id in cursos_ids:
                for b in bimestres:
                    n1, n2, n3 = 15.0, 16.0, 17.0
                    asist = 96
                    if alumno.id == "est-002":
                        n1, n2, n3 = 18.0, 19.0, 19.0
                        asist = 99
                    elif alumno.id == "est-003":
                        n1, n2, n3 = 12.0, 13.0, 12.0
                        asist = 88

                    nota = models.Nota(
                        alumno_id=alumno.id,
                        curso_id=curso_id,
                        periodo=b,
                        n1=n1,
                        n2=n2,
                        n3=n3,
                        asistencia=asist
                    )
                    db.add(nota)
        db.commit()

# Helper para armar la estructura de respuesta compatible con el frontend
def formatear_alumno(alumno: models.Alumno, db: Session) -> schemas.AlumnoSchema:
    cursos_db = db.query(models.Curso).all()
    cursos_formateados = []

    for curso in cursos_db:
        notas_dict = {}
        for b in ["bim1", "bim2", "bim3", "bim4"]:
            nota_registro = db.query(models.Nota).filter_by(
                alumno_id=alumno.id,
                curso_id=curso.id,
                periodo=b
            ).first()

            if nota_registro:
                notas_dict[b] = schemas.NotaPeriodoSchema(
                    n1=nota_registro.n1,
                    n2=nota_registro.n2,
                    n3=nota_registro.n3,
                    asistencia=nota_registro.asistencia
                )
            else:
                notas_dict[b] = schemas.NotaPeriodoSchema(n1=14.0, n2=14.0, n3=14.0, asistencia=95)

        cursos_formateados.append(schemas.CursoSchema(
            id=curso.id,
            nombre=curso.nombre,
            area=curso.area,
            profesor=curso.profesor,
            creditos=curso.creditos,
            notasPorPeriodo=notas_dict
        ))

    return schemas.AlumnoSchema(
        id=alumno.id,
        dni=alumno.dni,
        nombres=alumno.nombres,
        apellidos=alumno.apellidos,
        grado=alumno.grado,
        seccion=alumno.seccion,
        añoLectivo=alumno.ano_lectivo,
        tutor=alumno.tutor,
        estado=alumno.estado,
        cursos=cursos_formateados
    )

@app.on_event("startup")
def startup_event():
    with next(get_db()) as db:
        seed_database(db)

@app.get("/")
def inicio():
    return {
        "sistema": "EduControl Académico API",
        "estado": "Operativo",
        "basedatos": "SQLite (colegio.db)",
        "documentacion_swagger": "/docs"
    }

# 1. Obtener todos los alumnos (para el Dashboard)
@app.get("/api/alumnos", response_model=List[schemas.AlumnoSchema])
def obtener_alumnos(db: Session = Depends(get_db)):
    alumnos = db.query(models.Alumno).all()
    return [formatear_alumno(a, db) for a in alumnos]

# 2. Consultar alumno por DNI (para Familias y Alumnos)
@app.get("/api/alumnos/dni/{dni}", response_model=schemas.AlumnoSchema)
def obtener_alumno_por_dni(dni: str, db: Session = Depends(get_db)):
    alumno = db.query(models.Alumno).filter(models.Alumno.dni == dni).first()
    if not alumno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró ningún estudiante matriculado con el DNI {dni}."
        )
    return formatear_alumno(alumno, db)

# 3. Matricular nuevo alumno
@app.post("/api/alumnos", response_model=schemas.AlumnoCreateResponse, status_code=status.HTTP_201_CREATED)
def matricular_alumno(datos: schemas.AlumnoCreateSchema, db: Session = Depends(get_db)):
    # Validar DNI duplicado
    existente = db.query(models.Alumno).filter(models.Alumno.dni == datos.dni).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un estudiante registrado con este número de DNI."
        )

    nuevo_id = f"est-{uuid.uuid4().hex[:6]}"
    nuevo_alumno = models.Alumno(
        id=nuevo_id,
        dni=datos.dni,
        nombres=datos.nombres,
        apellidos=datos.apellidos,
        grado=datos.grado,
        seccion=datos.seccion,
        ano_lectivo=2026,
        tutor=datos.tutor,
        estado="Activo"
    )
    db.add(nuevo_alumno)
    db.commit()

    # Inicializar las notas en cero en los 3 cursos y 4 bimestres
    cursos = db.query(models.Curso).all()
    for curso in cursos:
        for b in ["bim1", "bim2", "bim3", "bim4"]:
            nueva_nota = models.Nota(
                alumno_id=nuevo_id,
                curso_id=curso.id,
                periodo=b,
                n1=0.0,
                n2=0.0,
                n3=0.0,
                asistencia=95
            )
            db.add(nueva_nota)
    db.commit()

    return {
        "message": "Alumno creado con éxito",
        "alumno": formatear_alumno(nuevo_alumno, db),
    }

# 4. Eliminar alumno y sus registros asociados
@app.delete("/api/alumnos/{alumno_id}")
def eliminar_alumno(alumno_id: str, db: Session = Depends(get_db)):
    alumno = db.query(models.Alumno).filter(models.Alumno.id == alumno_id).first()
    if not alumno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró el alumno que se desea eliminar."
        )

    db.delete(alumno)
    db.commit()
    return {"message": "Alumno eliminado con éxito"}

# 5. Actualizar calificaciones y asistencia (Modal de Calificación)
@app.put("/api/calificaciones")
def actualizar_calificacion(datos: schemas.CalificacionUpdateSchema, db: Session = Depends(get_db)):
    nota = db.query(models.Nota).filter_by(
        alumno_id=datos.alumno_id,
        curso_id=datos.curso_id,
        periodo=datos.periodo
    ).first()

    if not nota:
        # Si no existiera, la crea
        nota = models.Nota(
            alumno_id=datos.alumno_id,
            curso_id=datos.curso_id,
            periodo=datos.periodo,
            n1=datos.n1,
            n2=datos.n2,
            n3=datos.n3,
            asistencia=datos.asistencia
        )
        db.add(nota)
    else:
        nota.n1 = datos.n1
        nota.n2 = datos.n2
        nota.n3 = datos.n3
        nota.asistencia = datos.asistencia

    db.commit()
    return {"mensaje": "Calificaciones actualizadas exitosamente", "datos": datos}

# 6. Login docente (validación oficial)
@app.post("/api/login", response_model=schemas.LoginResponse)
def login_docente(credenciales: schemas.LoginRequest):
    if credenciales.usuario.strip() == "profesor" and credenciales.clave.strip() == "123":
        return schemas.LoginResponse(
            autenticado=True,
            docente="Prof. Carlos Paredes",
            mensaje="Autenticación exitosa"
        )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales incorrectas (Usuario o contraseña inválidos)"
    )
