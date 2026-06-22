# 🐳 GUÍA DE DOCKER - AGROCASTILLO

**Fecha:** Junio 2026  
**Versión:** 1.0

---

## 📋 CONTENIDO

1. [¿Qué es Docker?](#qué-es-docker)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación Docker](#instalación-docker)
4. [Pasos para Ejecutar con Docker](#pasos-para-ejecutar-con-docker)
5. [Comandos Útiles](#comandos-útiles)
6. [Troubleshooting](#troubleshooting)
7. [Deployment en Producción](#deployment-en-producción)

---

## ¿Qué es Docker?

**Docker** es una plataforma de containerización que empaqueta tu aplicación con todas sus dependencias en un contenedor.

### Ventajas:
- ✅ **Consistencia:** Funciona igual en laptop, servidor o cloud
- ✅ **Aislamiento:** No interfiere con otros proyectos
- ✅ **Escalabilidad:** Fácil de replicar y escalar
- ✅ **CI/CD:** Compatible con pipelines de automatización
- ✅ **Microservicios:** Ejecuta servicios independientes

### Arquitectura de AgroCastillo con Docker:

```
┌─────────────────────────────────────────────────────────┐
│           Docker Container                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Frontend │  │ Backend  │  │PostgreSQL│             │
│  │ (Nginx)  │  │(Spring)  │  │(BD)      │             │
│  │:4200     │  │:8443     │  │:5432     │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Requisitos Previos

### 1. Docker Desktop instalado
- **Windows/Mac:** [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux:** `sudo apt-get install docker-ce docker-compose-plugin`

### 2. Archivos necesarios en el proyecto
```
✅ Dockerfile.backend      (cómo compilar backend)
✅ Dockerfile.frontend     (cómo compilar frontend)
✅ docker-compose.yml      (orquestar servicios)
✅ nginx.conf              (configurar Nginx)
✅ .env.local              (variables de entorno)
```

### 3. Espacio en disco
- ~3 GB para imágenes base
- ~500 MB para compilación
- ~100 MB para base de datos

---

## Instalación Docker

### Windows 10/11
```powershell
# 1. Descargar Docker Desktop desde https://www.docker.com/products/docker-desktop
# 2. Ejecutar installer
# 3. Reiniciar Windows
# 4. Verificar instalación
docker --version
docker run hello-world
```

### macOS
```bash
# Usando Homebrew
brew install --cask docker

# O descargar desde https://www.docker.com/products/docker-desktop
```

### Linux (Ubuntu/Debian)
```bash
# 1. Instalar Docker
sudo apt-get update
sudo apt-get install docker.io docker-compose-plugin -y

# 2. Agregar usuario al grupo docker (sin sudo)
sudo usermod -aG docker $USER
newgrp docker

# 3. Verificar
docker --version
```

---

## 🚀 Pasos para Ejecutar con Docker

### PASO 1: Preparar Variables de Entorno

```bash
# 1. Ir a la raíz del proyecto
cd AgroCastillo

# 2. Copiar plantilla
cp .env.local.example .env.local

# 3. Editar .env.local con tus valores
nano .env.local  # O editar con tu editor favorito
```

**Variables mínimas requeridas:**
```env
DB_PASSWORD=tu_password_seguro_CAMBIAR
JWT_SECRET=tu_clave_aleatoria_minimo_32_chars
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

### PASO 2: Construir Imágenes Docker

```bash
# Opción A: Build individual
docker build -f Dockerfile.backend -t agrocastillo-backend:1.0 .
docker build -f Dockerfile.frontend -t agrocastillo-frontend:1.0 .

# Opción B: Build con docker-compose (más fácil)
docker-compose build
```

**Esto tardará:**
- Backend: ~5-10 minutos (primera vez)
- Frontend: ~3-5 minutos (primera vez)
- Siguientes veces: segundos (usa caché)

### PASO 3: Iniciar Servicios

```bash
# Iniciar en background
docker-compose up -d

# O ver logs en tiempo real
docker-compose up
```

**Esperado:**
```
Creating agrocastillo-postgres  ... done
Creating agrocastillo-backend   ... done
Creating agrocastillo-frontend  ... done
```

### PASO 4: Verificar que Todo Está Corriendo

```bash
# Ver estado de servicios
docker-compose ps

# Salida esperada:
# NAME                    COMMAND                  STATUS
# agrocastillo-postgres   "docker-entrypoint..."   Up (healthy)
# agrocastillo-backend    "java -jar app.jar"      Up (healthy)
# agrocastillo-frontend   "nginx -g daemon off"    Up (healthy)
```

### PASO 5: Acceder a la Aplicación

```
Frontend:  https://localhost:4200
Backend:   https://localhost:8443/api
Swagger:   https://localhost:8443/api/swagger-ui.html
PostgreSQL: localhost:5432
```

### PASO 6: Detener Servicios

```bash
# Detener sin eliminar datos
docker-compose stop

# Detener y eliminar contenedores (datos persisten en volumen)
docker-compose down

# Detener y eliminar TODA la data (incluyendo BD)
docker-compose down -v
```

---

## 📝 Comandos Útiles

### Ver Logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend

# Solo PostgreSQL
docker-compose logs -f postgres

# Últimas 100 líneas
docker-compose logs --tail=100
```

### Ejecutar Comandos en Contenedores

```bash
# Acceder a bash del backend
docker-compose exec backend bash

# Ejecutar comando en backend
docker-compose exec backend curl -k https://localhost:8443/api/health

# Acceder a PostgreSQL
docker-compose exec postgres psql -U postgres -d AgroCastillo

# Ejecutar SQL
docker-compose exec postgres psql -U postgres -d AgroCastillo -c "SELECT VERSION();"
```

### Reiniciar Servicios

```bash
# Reiniciar todos
docker-compose restart

# Reiniciar uno específico
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres
```

### Ver Consumo de Recursos

```bash
docker stats
```

### Eliminar Imágenes y Volúmenes

```bash
# Eliminar volúmenes (CUIDADO: pierdes datos)
docker-compose down -v

# Eliminar imágenes
docker rmi agrocastillo-backend:1.0
docker rmi agrocastillo-frontend:1.0

# Limpiar todo (contenedores, imágenes, redes sin usar)
docker system prune -a
```

---

## 🔧 Troubleshooting

### Error: "Port 5432 already in use"
```bash
# PostgreSQL ya está corriendo en tu máquina local

# Opción 1: Detener PostgreSQL local
# Windows: Services > PostgreSQL > Stop
# Mac: brew services stop postgresql
# Linux: sudo systemctl stop postgresql

# Opción 2: Cambiar puerto en docker-compose.yml
ports:
  - "5433:5432"  # Host:Container
```

### Error: "Cannot connect to Docker daemon"
```bash
# Docker no está corriendo

# Windows/Mac: Abre Docker Desktop
# Linux: sudo systemctl start docker
# Verifica: docker ps
```

### Error: "Build context must be a directory"
```bash
# Asegúrate de estar en la raíz del proyecto
cd AgroCastillo

# Verifica que existan los archivos
ls Dockerfile.backend
ls Dockerfile.frontend
ls docker-compose.yml
```

### Backend no conecta a PostgreSQL
```bash
# Verificar logs
docker-compose logs backend

# Verificar que postgres está corriendo y healthy
docker-compose ps

# Entrar a backend y probar conexión
docker-compose exec backend bash
# Dentro del contenedor:
nc -zv postgres 5432
```

### Frontend no puede conectar al backend
```bash
# Verificar que backend está corriendo
docker-compose ps

# Ver logs del backend
docker-compose logs backend

# Verificar que nginx está correcto
docker-compose exec frontend cat /etc/nginx/nginx.conf
```

### Certificado SSL "not trusted"
```
# Esto es normal en desarrollo con certificados self-signed
# Navegador: Click en Advanced → Proceed anyway
# Curl: -k o --insecure
# Angular: El HttpClient debe estar configurado para confiar
```

---

## 🌐 Deployment en Producción

### Registrar Imágenes en Registry

```bash
# 1. Login a Docker Hub
docker login

# 2. Taggear imágenes
docker tag agrocastillo-backend:1.0 tuusuario/agrocastillo-backend:1.0
docker tag agrocastillo-frontend:1.0 tuusuario/agrocastillo-frontend:1.0

# 3. Pushear a Docker Hub
docker push tuusuario/agrocastillo-backend:1.0
docker push tuusuario/agrocastillo-frontend:1.0
```

### Deployment en Kubernetes

```yaml
# deployment.yaml
apiVersion: v1
kind: Pod
metadata:
  name: agrocastillo-backend
spec:
  containers:
  - name: backend
    image: tuusuario/agrocastillo-backend:1.0
    ports:
    - containerPort: 8443
    env:
    - name: DB_HOST
      value: postgres-service
```

```bash
kubectl apply -f deployment.yaml
```

### Deployment en AWS ECS

```bash
# 1. Crear cluster
aws ecs create-cluster --cluster-name agrocastillo

# 2. Registrar task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# 3. Crear servicio
aws ecs create-service --cluster agrocastillo --service-name backend --task-definition agrocastillo-backend --desired-count 2
```

### Deployment en Google Cloud Run

```bash
# 1. Autenticar
gcloud auth login

# 2. Build y push
gcloud builds submit --tag gcr.io/MY_PROJECT/agrocastillo-backend

# 3. Deploy
gcloud run deploy agrocastillo-backend \
  --image gcr.io/MY_PROJECT/agrocastillo-backend \
  --platform managed \
  --region us-central1
```

---

## 🔐 Seguridad en Docker

### No versionar .env.local
```bash
# .env.local ya está en .gitignore
# Verificar:
cat .gitignore | grep ".env"
```

### Usar imágenes oficiales
```dockerfile
FROM eclipse-temurin:17-jre-alpine  ✅ Oficial y confiable
FROM java:8                         ❌ Deprecated
```

### Escanear vulnerabilidades
```bash
# Docker Scout (integrado)
docker scout cves agrocastillo-backend:1.0

# O usar Trivy
trivy image agrocastillo-backend:1.0
```

### No usar root
```dockerfile
USER appuser  # ✅ Usuario no-root
# USER root   # ❌ Nunca
```

---

## 📚 Recursos Adicionales

- [Documentación Oficial Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices Dockerfile](https://docs.docker.com/develop/dev-best-practices/dockerfile-best-practices/)
- [Docker Security](https://docs.docker.com/engine/security/)

---

## ✅ Checklist Docker

- [ ] Docker Desktop instalado
- [ ] Archivos Dockerfile creados
- [ ] docker-compose.yml configurado
- [ ] nginx.conf creado
- [ ] .env.local con variables
- [ ] Imágenes compiladas (`docker-compose build`)
- [ ] Servicios iniciados (`docker-compose up -d`)
- [ ] Todos healthy (`docker-compose ps`)
- [ ] Frontend accesible en localhost:4200
- [ ] Backend accesible en localhost:8443
- [ ] PostgreSQL conectado correctamente
- [ ] Logs sin errores (`docker-compose logs`)

---

## 🎓 Conclusión

Docker hace tu aplicación:
- ✅ Portable (laptop → cloud)
- ✅ Reproducible (mismo comportamiento siempre)
- ✅ Escalable (múltiples instancias)
- ✅ Mantenible (fácil de actualizar)

**Próximo paso:** `docker-compose up -d` 🚀

