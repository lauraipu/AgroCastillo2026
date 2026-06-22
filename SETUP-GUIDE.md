# 📋 GUÍA DE CONFIGURACIÓN - AgroCastillo Desarrollo Local
> **Auditoría de Seguridad v1.0** | Junio 2026

## 🎯 Objetivo
Guía paso a paso para configurar AgroCastillo en tu máquina local con variables de entorno seguras.

---

## 📁 Estructura de Configuración

```
AgroCastillo/
├── .env.example                    ← Plantilla pública (versionar)
├── .env.local                      ← TUS valores reales (NO versionar)
├── .env.local.example              ← Plantilla adicional para dev
├── .gitignore                      ← Protege .env.local
│
├── AgroCastillo-backend/
│   ├── src/main/resources/
│   │   ├── application.properties  ← Configuración base (CAMBIAR a env vars)
│   │   └── application-dev.properties ← Config de desarrollo (nuevo)
│
└── AgroCastillo-frontend/
    └── src/environments/
        ├── environment.ts          ← Config de producción
        └── environment.development.ts ← Config de desarrollo
```

---

## ⚙️ PASO 1: Configurar el Backend (Spring Boot)

### 1.1 Crear archivo `.env.local`

```bash
# En la raíz del proyecto
cp .env.local.example .env.local

# Editar con tus valores reales
nano .env.local
```

### 1.2 Valores mínimos requeridos

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=AgroCastillo
DB_USER=postgres
DB_PASSWORD=tu_password_real_CAMBIAR

# JWT
JWT_SECRET=generador_aleatorio_minimo_32_caracteres

# Google OAuth2 (opcional para login)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# Frontend URL
FRONTEND_URL=https://localhost:4200
```

### 1.3 Actualizar application.properties

> **Antes** (❌ INSEGURO - hardcoded):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/AgroCastillo
spring.datasource.username=postgres
spring.datasource.password=admin123
```

> **Después** (✅ SEGURO - variables de entorno):
```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:AgroCastillo}}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
```

### 1.4 Pasar variables al ejecutar

**Opción A: Línea de comando**
```bash
java -Xmx512m \
  -DDB_HOST=localhost \
  -DDB_PORT=5432 \
  -DDB_NAME=AgroCastillo \
  -DDB_USER=postgres \
  -DDB_PASSWORD=tu_password \
  -DJWT_SECRET=tu_clave_secreta_32chars \
  -jar target/agrocastillo-backend.jar
```

**Opción B: Variables de sistema (Linux/Mac)**
```bash
export DB_HOST=localhost
export DB_USER=postgres
export DB_PASSWORD=tu_password
export JWT_SECRET=tu_clave_secreta_32chars
# ... más variables
cd AgroCastillo-backend
mvn spring-boot:run
```

**Opción C: Variables de sistema (Windows PowerShell)**
```powershell
$env:DB_HOST="localhost"
$env:DB_USER="postgres"
$env:DB_PASSWORD="tu_password"
$env:JWT_SECRET="tu_clave_secreta_32chars"
# ... más variables
cd AgroCastillo-backend
mvn spring-boot:run
```

---

## 🎨 PASO 2: Configurar el Frontend (Angular)

### 2.1 Actualizar environment.development.ts

```typescript
// src/environments/environment.development.ts

export const environment = {
  production: false,
  apiUrl: 'https://localhost:8443/api',
  
  // Sincronizar con .env.local
  jwt: {
    expirationMs: 86400000  // 24 horas (debe coincidir con JWT_EXPIRATION)
  },
  
  oauth2: {
    google: {
      clientId: 'tu_google_client_id_aqui'  // De GOOGLE_CLIENT_ID
    }
  }
};
```

### 2.2 Conectar servicios al backend

Los siguientes servicios ya han sido actualizado para conectar con la BD:

```typescript
// src/app/services/investigador.service.ts
- Carga perfil desde: GET /api/perfil-investigador/perfil
- Carga aplicaciones desde: GET /api/investigador/aplicaciones

// src/app/services/mis-aplicaciones.service.ts
- Carga aplicaciones desde: GET /api/investigador/aplicaciones
- Crear desde: POST /api/investigador/aplicaciones
- Actualizar desde: PUT /api/investigador/aplicaciones/{id}
- Eliminar desde: DELETE /api/investigador/aplicaciones/{id}
```

### 2.3 Verificar encabezados de autenticación

Todos los servicios ahora incluyen automáticamente el JWT:

```typescript
private getHeaders(): HttpHeaders {
  const token = this.authService.getToken();
  let headers = new HttpHeaders();
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}
```

---

## 🔐 PASO 3: Generar Clave JWT Segura

### Para desarrollo local (inseguro, solo local):
```bash
# Linux/Mac
echo $(openssl rand -base64 32)

# Salida ejemplo: kY8vX2nQ5pL7mJ3hR9wF6dE0sZ1aB4cT5uV8nW2xY=
```

### Para producción (MÁS SEGURO):
```bash
# Usar algoritmo más fuerte
openssl rand -hex 32

# Salida ejemplo: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
```

---

## 🗄️ PASO 4: Configurar Base de Datos

### 4.1 Verificar PostgreSQL está ejecutándose

```bash
# Conectar a PostgreSQL
psql -U postgres -h localhost

# Ver bases de datos
\l

# Seleccionar BD
\c AgroCastillo

# Ver tablas
\dt

# Salir
\q
```

### 4.2 Ejecutar scripts de inicialización

```bash
# Si existen scripts SQL
psql -U postgres -h localhost -d AgroCastillo -f schema.sql
psql -U postgres -h localhost -d AgroCastillo -f data.sql
```

---

## ▶️ PASO 5: Ejecutar la Aplicación

### Opción A: Ejecutar con Maven (Backend)

```bash
cd AgroCastillo-backend

# Compilar
mvn clean compile

# Ejecutar con perfil dev
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

### Opción B: Ejecutar con Angular (Frontend)

```bash
cd AgroCastillo-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ng serve --open

# O: npm start
npm start
```

### Opción C: Ejecutar ambos simultáneamente

```bash
# Terminal 1: Backend
cd AgroCastillo-backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Terminal 2: Frontend
cd AgroCastillo-frontend
ng serve --open
```

---

## ✅ VERIFICACIÓN

### Checklist de configuración

- [ ] `.env.local` creado con tus valores
- [ ] `.env.local` añadido a `.gitignore`
- [ ] PostgreSQL corriendo en localhost:5432
- [ ] Base de datos `AgroCastillo` existe
- [ ] Backend ejecutándose en `https://localhost:8443`
- [ ] Frontend ejecutándose en `https://localhost:4200`
- [ ] Poder acceder a `/api/v3/api-docs` en el backend (Swagger)
- [ ] Poder acceder a Swagger UI en `/api/swagger-ui.html`

### Test rápido de conectividad

```bash
# Desde terminal (requiere curl)
curl -k https://localhost:8443/api/v3/api-docs

# Deberías ver un JSON con la documentación de OpenAPI
```

---

## 🚨 PROBLEMAS COMUNES

### ❌ Error: "Database connection refused"
```
Solución:
1. Verificar PostgreSQL está corriendo: psql -U postgres
2. Verificar BD existe: \l (en psql)
3. Verificar variables DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
4. Verificar firewall no bloquea puerto 5432
```

### ❌ Error: "CORS error in frontend"
```
Solución:
1. Verificar CORS_ALLOWED_ORIGINS en .env.local incluye https://localhost:4200
2. Verificar backend está ejecutándose en puerto correcto (8443)
3. Verificar frontend llama a la URL correcta del backend
```

### ❌ Error: "JWT expired"
```
Solución:
1. Verificar JWT_EXPIRATION es suficiente (ej: 86400000 = 24h)
2. Verificar JWT_SECRET es igual en backend y servicios Angular
3. Limpiar localStorage del navegador: localStorage.clear()
```

### ❌ Error: "SSL certificate problem"
```
Solución (solo local):
1. Usar -k en curl: curl -k https://localhost:8443/api/...
2. En navegador: Aceptar certificado self-signed
3. En Angular: Confiar en certificado local (HttpClientModule config)
```

---

## 📚 DOCUMENTACIÓN ADICIONAL

- **Backend**: Ver `README.md` sección "Backend Setup"
- **Frontend**: Ver `README.md` sección "Frontend Setup"
- **API Docs**: Swagger en `https://localhost:8443/api/swagger-ui.html`
- **Auditoría**: Ver `AUDIT_REPORT.md` para detalles de seguridad

---

## 🎓 SIGUIENTES PASOS

Después de configuración completada:

1. **Desarrollo**: Usar `ng serve` y `mvn spring-boot:run` para development
2. **Testing**: Ejecutar pruebas unitarias y de integración
3. **Build Producción**: Ver sección de Deployment en README.md
4. **Deployment**: Usar variables de entorno reales en hosting

---

*Documento creado: Junio 2026*  
*Última actualización: Auditoría de Seguridad AgroCastillo v1.0*
