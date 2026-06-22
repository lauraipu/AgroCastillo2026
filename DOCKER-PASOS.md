# 🐳 PASOS FINALES - DOCKER READY

## ✅ ARCHIVOS CREADOS PARA DOCKER

### 1. Dockerfiles
```
✅ Dockerfile.backend     - Compilación multi-etapa backend Java/Spring
✅ Dockerfile.frontend    - Compilación multi-etapa frontend Angular/Nginx
```

### 2. Orquestación
```
✅ docker-compose.yml     - Orquesta PostgreSQL, Backend, Frontend
✅ nginx.conf             - Configuración Nginx (proxy y static files)
```

### 3. Documentación
```
✅ DOCKER-GUIDE.md        - Guía completa de Docker (11.3 KB)
```

---

## 🚀 PASOS A SEGUIR (En Orden)

### PASO 1: Instalar Docker
```bash
# Windows 10/11 o Mac:
# Descargar Docker Desktop: https://www.docker.com/products/docker-desktop

# Linux:
sudo apt-get install docker.io docker-compose-plugin -y
sudo usermod -aG docker $USER

# Verificar
docker --version
docker-compose --version
```

---

### PASO 2: Preparar Proyecto
```bash
# 1. Ir a raíz del proyecto
cd AgroCastillo

# 2. Crear .env.local si no existe
cp .env.local.example .env.local

# 3. Editar .env.local con valores reales
# Variables CRÍTICAS:
#   DB_PASSWORD=tu_password_seguro
#   JWT_SECRET=aleatorio_32_caracteres_minimo
#   GOOGLE_CLIENT_ID=tu_id
#   GOOGLE_CLIENT_SECRET=tu_secret
```

---

### PASO 3: Compilar Imágenes
```bash
# Option A: Con docker-compose (recomendado)
docker-compose build

# Option B: Manual individual
docker build -f Dockerfile.backend -t agrocastillo-backend:1.0 .
docker build -f Dockerfile.frontend -t agrocastillo-frontend:1.0 .

# Tiempo esperado:
# - Primera vez: 10-15 minutos
# - Siguientes: 30 segundos (usa caché)
```

---

### PASO 4: Iniciar Servicios
```bash
# Iniciar en background
docker-compose up -d

# O ver logs en vivo
docker-compose up

# Esperado:
# Creating agrocastillo-postgres  ... done
# Creating agrocastillo-backend   ... done
# Creating agrocastillo-frontend  ... done
```

---

### PASO 5: Esperar a que estén Healthy
```bash
# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Debe mostrar "healthy" en 30-60 segundos:
# - postgres: Up (healthy)
# - backend: Up (healthy)
# - frontend: Up (healthy)
```

---

### PASO 6: Acceder a la Aplicación
```
🌐 Frontend:  https://localhost:4200
🌐 Backend:   https://localhost:8443/api
📚 Swagger:   https://localhost:8443/api/swagger-ui.html
🗄️  PostgreSQL: localhost:5432
```

**Nota:** El certificado SSL es self-signed (desarrollo)
- Navegador: Click "Advanced" → "Proceed"
- Curl: Usar `-k` flag

---

### PASO 7: Pruebas Básicas

**Test Backend:**
```bash
curl -k https://localhost:8443/api/health
# Respuesta: {"status":"UP"}
```

**Test Frontend:**
```bash
# Navegar a https://localhost:4200
# Deberías ver la aplicación Angular
```

**Test Base de Datos:**
```bash
docker-compose exec postgres psql -U postgres -d AgroCastillo -c "SELECT VERSION();"
```

---

### PASO 8: Detener (Cuando Termines)
```bash
# Opción 1: Solo pausar (datos persisten)
docker-compose stop

# Opción 2: Detener y remover contenedores (datos en volumen persisten)
docker-compose down

# Opción 3: Eliminar TODO incluyendo datos (CUIDADO)
docker-compose down -v
```

---

## 🔥 COMANDOS RÁPIDOS ÚTILES

### Ver Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Acceder a Contenedores
```bash
# Bash en backend
docker-compose exec backend bash

# PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d AgroCastillo
```

### Reiniciar Servicios
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres
```

### Ver Consumo de Recursos
```bash
docker stats
```

---

## 📊 ESTRUCTURA DE SERVICIOS

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PostgreSQL (puerto 5432)                                   │
│  ├─ Volumen: postgres_data (persistencia)                  │
│  ├─ Health: pg_isready check cada 10s                      │
│  └─ Variables: DB_USER, DB_PASSWORD, DB_NAME              │
│                                                              │
│  Backend (puerto 8443)                                      │
│  ├─ Java 17 + Spring Boot                                 │
│  ├─ Health: GET /api/health cada 30s                       │
│  ├─ Variables: DB_HOST=postgres, JWT_SECRET, etc          │
│  └─ Depende de: postgres (healthy)                         │
│                                                              │
│  Frontend (puerto 4200)                                     │
│  ├─ Angular + Nginx                                        │
│  ├─ Health: GET /health cada 30s                           │
│  ├─ Proxy: /api/* → https://backend:8443/api/            │
│  └─ Depende de: backend (running)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ PROBLEMAS COMUNES & SOLUCIONES

### "Port 5432 already in use"
```bash
# Detener PostgreSQL local
sudo systemctl stop postgresql
# O cambiar puerto en docker-compose.yml: ports: ["5433:5432"]
```

### "Cannot connect to Docker daemon"
```bash
# Iniciar Docker Desktop (Windows/Mac)
# O en Linux: sudo systemctl start docker
```

### Backend no conecta a PostgreSQL
```bash
# Ver logs
docker-compose logs backend

# Verificar network
docker-compose exec backend ping postgres

# Verificar puerto
docker-compose exec backend nc -zv postgres 5432
```

### Frontend no puede conectar a backend
```bash
# Ver logs nginx
docker-compose logs frontend

# Verificar que backend está healthy
docker-compose ps

# Test desde frontend
docker-compose exec frontend curl -k https://backend:8443/api/health
```

### Certificado SSL no confiable
```
# Normal en desarrollo
# Navegador: Advanced → Proceed anyway
# Curl: curl -k https://localhost:8443/api/...
```

---

## 📚 DOCUMENTACIÓN ADICIONAL

📖 **DOCKER-GUIDE.md** - Guía completa (11 KB)
- ¿Qué es Docker?
- Requisitos previos
- Instalación
- Comandos útiles
- Troubleshooting
- Deployment producción

---

## ✅ CHECKLIST FINAL

- [ ] Docker Desktop instalado
- [ ] `docker --version` funciona
- [ ] `.env.local` creado y configurado
- [ ] Archivos Docker existentes:
  - [ ] Dockerfile.backend
  - [ ] Dockerfile.frontend
  - [ ] docker-compose.yml
  - [ ] nginx.conf
- [ ] `docker-compose build` completado
- [ ] `docker-compose up -d` ejecutado
- [ ] `docker-compose ps` muestra todos "healthy"
- [ ] Frontend accesible: https://localhost:4200
- [ ] Backend accesible: https://localhost:8443/api
- [ ] PostgreSQL conectado correctamente
- [ ] Logs sin errores: `docker-compose logs`

---

## 🎉 ¡LISTO!

Tu proyecto está **completamente dockerizado** y listo para:

✅ Desarrollo local consistente  
✅ CI/CD pipelines  
✅ Deployment en producción  
✅ Escalado horizontal  
✅ Gestión con Kubernetes  

**Próximo comando:**
```bash
docker-compose up -d
```

---

**AgroCastillo Docker Ready**  
**Fecha:** Junio 2026  
**Estado:** ✅ COMPLETADO

