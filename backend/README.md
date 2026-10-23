# Backend FastAPI + SQLite (EduControl Académico)

Este backend gestiona la persistencia de datos en una base de datos local SQLite (`backend/colegio.db`) para el sistema escolar. El archivo siempre se ubica junto a `database.py`, independientemente de la carpeta desde la que se inicie Uvicorn.

## Requisitos Previos
- Python 3.9 o superior instalado en tu computadora.
- Visual Studio Code.

## Pasos para ejecutar en Visual Studio Code

### 1. Abrir la terminal integrada de VS Code
Presiona ``Ctrl + ` `` (o menú **Terminal > New Terminal**).

### 2. Ingresar a la carpeta del backend
```bash
cd backend
```

### 3. Crear y activar tu entorno virtual (Recomendado)
- En Windows (PowerShell):
  ```bash
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```
- En Mac/Linux:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

### 4. Instalar las dependencias
```bash
pip install -r requirements.txt
```

### 5. Iniciar el servidor FastAPI
```bash
uvicorn main:app --reload --port 8000
```

### 6. Probar la API
- **Documentación Swagger interactiva**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Ruta de bienvenida**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

La base de datos SQLite `colegio.db` se creará y se poblará automáticamente con los 3 cursos (Matemáticas, Ciencias y Comunicación) y los alumnos de prueba al primer inicio.
