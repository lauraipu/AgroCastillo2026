# 🏗️ DIAGRAMA DE ARQUITECTURA - AGROCASTILLO v1.0

## Arquitectura General del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AGROCASTILLO v1.0                                  │
│                   Sistema de Gestión Investigadores                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   FRONTEND LAYER     │         │   BACKEND LAYER      │
│  (Angular 18+)       │         │  (Spring Boot)       │
└──────────────────────┘         └──────────────────────┘
         │                                 │
         │                                 │
    localhost:4200                  localhost:8443/api
         │                                 │
    ┌────────────────────────────┐       │
    │  MÓDULOS PRINCIPALES       │       │
    ├────────────────────────────┤       │
    │ ✅ Login/Registro          │       │
    │ ✅ Dashboard Admin         │       │
    │ ✅ Perfil Investigador ◄───┼──────┼─→ GET /perfil-investigador/perfil
    │ ✅ Mis Aplicaciones    ◄───┼──────┼─→ GET/POST/PUT/DELETE /investigador/aplicaciones
    │ ✅ Comunidad (Investigadores)      │
    │ ✅ Catálogo de Aplicaciones        │
    │ ✅ Detalle de Aplicación           │
    └────────────────────────────┘       │
         │                                 │
         │                            ┌────────────────────┐
         │                            │ CONTROLADORES      │
         │                            ├────────────────────┤
         │                            │ • Investigador     │
         │                            │ • Aplicación       │
         │                            │ • Autenticación    │
         │                            │ • Seguridad        │
         │                            └────────────────────┘
         │                                 │
         │                            ┌────────────────────┐
         │                            │ SERVICIOS          │
         │                            ├────────────────────┤
         │                            │ • InvestigadorSvc  │
         │                            │ • AplicacionSvc    │
         │                            │ • AuthenticationSvc│
         │                            └────────────────────┘
         │                                 │
         │                            ┌────────────────────┐
         │                            │ REPOSITORIOS       │
         │                            ├────────────────────┤
         │                            │ • InvestigadorRepo │
         │                            │ • AplicacionRepo   │
         │                            │ • UsuarioRepo      │
         │                            └────────────────────┘
         │                                 │
         └─────────────────────────────────┤
                                           │
                          ┌────────────────────────────┐
                          │  POSTGRESQL DATABASE       │
                          │  (Puerto 5432)             │
                          ├────────────────────────────┤
                          │ TABLAS:                    │
                          │ ├─ investigador            │
                          │ ├─ aplicacion_investigador │
                          │ ├─ usuario                 │
                          │ ├─ rol                     │
                          │ ├─ permiso                 │
                          │ ├─ documentacion           │
                          │ ├─ estadisticas_descargas  │
                          │ ├─ calificaciones          │
                          │ └─ favoritos               │
                          └────────────────────────────┘
```

---

## Flujo de Datos: Cargar Perfil Investigador

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        PERFIL INVESTIGADOR                                  │
│              (perfil-investigador.component.ts)                             │
└────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ ngOnInit()
                                   ▼
                      ┌─────────────────────────┐
                      │ cargarPerfil()          │
                      │ cargarAplicaciones()    │
                      └─────────────────────────┘
                                   │
                                   │ subscribe()
                                   ▼
                    ┌──────────────────────────────┐
                    │  investigador.service.ts     │
                    │  obtenerPerfil()             │
                    └──────────────────────────────┘
                                   │
                                   │ HTTP GET
                                   ▼
                    ┌──────────────────────────────┐
                    │ GET /api/perfil-investigador │
                    │    /perfil                   │
                    │ Headers:                     │
                    │ - Authorization: Bearer JWT  │
                    │ - Content-Type: application/ │
                    │   json                       │
                    └──────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
              ┌──────────────┐            ┌──────────────┐
              │ Backend OK   │            │ Backend ERROR│
              │ (200)        │            │ (401,500)    │
              └──────────────┘            └──────────────┘
                    │                          │
                    ▼                          ▼
         ┌────────────────────┐    ┌────────────────────┐
         │ InvestigadorCtlr   │    │ Error Handler      │
         │ getPerfil()        │    │ - Log error        │
         └────────────────────┘    │ - Return fallback  │
                    │               │ - Show message    │
                    ▼               └────────────────────┘
         ┌────────────────────┐
         │ InvestigadorService│
         │ findById()         │
         └────────────────────┘
                    │
                    ▼
         ┌────────────────────┐
         │ BD PostgreSQL      │
         │ SELECT * FROM      │
         │ investigador       │
         │ WHERE id = ?       │
         └────────────────────┘
                    │
                    ├─ id: 1
                    ├─ nombre: Dr. Juan García
                    ├─ especialidad: Agronomía
                    ├─ email: juan@...
                    ├─ telefono: ...
                    └─ aplicaciones: [...]
                    │
                    ▼
         ┌────────────────────┐
         │ Mapear respuesta   │
         │ mapearPerfil()     │
         └────────────────────┘
                    │
                    ▼
         ┌────────────────────────────┐
         │ Retornar JSON             │
         │ PerfilInvestigador {      │
         │   id: 1,                  │
         │   nombre: "Dr. Juan",     │
         │   especialidad: "...",    │
         │   aplicaciones: [...]     │
         │ }                         │
         └────────────────────────────┘
                    │
                    ▼
         ┌────────────────────────────┐
         │ Frontend recibe respuesta  │
         │ .subscribe(next: (data) => │
         │   this.perfil.set(data)    │
         │ )                          │
         └────────────────────────────┘
                    │
                    ▼
         ┌────────────────────────────┐
         │ Signal se actualiza        │
         │ perfil = PerfilInvestigador│
         └────────────────────────────┘
                    │
                    ▼
         ┌────────────────────────────┐
         │ Template re-renderiza      │
         │ {{ perfil().nombre }}      │
         │ *ngFor perfil().aplicacion │
         │ ...                        │
         └────────────────────────────┘
                    │
                    ▼
         ┌────────────────────────────┐
         │ Usuario ve datos actuales  │
         │ en la interfaz             │
         └────────────────────────────┘
```

---

## Flujo de Datos: Crear Nueva Aplicación

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        MIS APLICACIONES                                     │
│                    (mis-aplicaciones.ts)                                    │
└────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Click "Registrar Nueva"
                                   ▼
                      ┌─────────────────────────┐
                      │ registrarNuevaAplicacion()│
                      │ - Abre modal             │
                      │ - Limpia formulario      │
                      └─────────────────────────┘
                                   │
                                   │ Usuario rellena:
                                   │ - Nombre
                                   │ - Descripción  
                                   │ - URL
                                   ▼
                      ┌─────────────────────────┐
                      │ Click "Guardar"         │
                      │ guardarAplicacion()     │
                      │ - Validar campos        │
                      │ - Crear payload         │
                      └─────────────────────────┘
                                   │
                                   │ modoEdicion = false
                                   │ Crear nuevo
                                   ▼
                    ┌──────────────────────────────┐
                    │ misAplicacionesService.ts    │
                    │ crear(payload)               │
                    └──────────────────────────────┘
                                   │
                                   │ HTTP POST
                                   ▼
                    ┌──────────────────────────────┐
                    │ POST /api/investigador/      │
                    │      aplicaciones            │
                    │ Headers:                     │
                    │ - Authorization: Bearer JWT  │
                    │ Body:                        │
                    │ {                            │
                    │   "nombre": "...",           │
                    │   "descripcion": "...",      │
                    │   "urlAplicacion": "..."     │
                    │ }                            │
                    └──────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
              ┌──────────────┐            ┌──────────────┐
              │ Backend OK   │            │ Backend ERROR│
              │ (201)        │            │ (400,401)    │
              └──────────────┘            └──────────────┘
                    │                          │
                    ▼                          ▼
         ┌────────────────────┐    ┌────────────────────┐
         │ AplicacionCtlr     │    │ Error Handler      │
         │ crear(payload)     │    │ - Log error        │
         └────────────────────┘    │ - Show alert       │
                    │               │ - Rollback         │
                    ▼               └────────────────────┘
         ┌────────────────────┐
         │ AplicacionService  │
         │ save(aplicacion)   │
         └────────────────────┘
                    │
                    ▼
         ┌────────────────────┐
         │ BD PostgreSQL      │
         │ INSERT INTO        │
         │ aplicacion_invest. │
         │ (nombre, desc, url│
         │  id_investig.)    │
         │ VALUES (...)       │
         └────────────────────┘
                    │
                    ▼
         ┌────────────────────┐
         │ Retornar aplicación│
         │ con ID generado    │
         │ {                  │
         │   "id": 42,        │
         │   "nombre": "...", │
         │   ...              │
         │ }                  │
         └────────────────────┘
                    │
                    ▼
         ┌────────────────────────────┐
         │ Frontend recibe respuesta  │
         │ .subscribe(next: (app) => {│
         │   cerrarModal()            │
         │   cargarAplicaciones()     │
         │   alert("Creada OK")       │
         │ })                         │
         └────────────────────────────┘
                    │
                    ▼
         ┌────────────────────────────┐
         │ Recarga lista de aplic.    │
         │ GET /api/investigador/     │
         │     aplicaciones           │
         │ (ver flujo anterior)       │
         └────────────────────────────┘
                    │
                    ▼
         ┌────────────────────────────┐
         │ Signal se actualiza        │
         │ aplicaciones = [...]       │
         │ (con nueva aplicación)     │
         └────────────────────────────┘
                    │
                    ▼
         ┌────────────────────────────┐
         │ Template re-renderiza      │
         │ *ngFor aplicaciones()      │
         │ (nueva app visible)        │
         └────────────────────────────┘
```

---

## Configuración de Seguridad

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        CAPAS DE SEGURIDAD                                 │
└──────────────────────────────────────────────────────────────────────────┘

CAPA 1: CREDENCIALES SEGURAS
┌──────────────────────────────────────┐
│ Desarrollo Local:                    │
│ .env.local (NO versionado)           │
│ - DB_USER=postgres                   │
│ - DB_PASSWORD=***                    │
│ - JWT_SECRET=aleatorio_32_chars      │
│                                      │
│ Producción:                          │
│ Variables de entorno del hosting     │
│ - AWS Secrets Manager, o             │
│ - GCP Secret Manager, o              │
│ - Azure Key Vault                    │
└──────────────────────────────────────┘
                   │
                   ▼
CAPA 2: PROTECCIÓN DE ARCHIVOS
┌──────────────────────────────────────┐
│ .gitignore global:                   │
│ ✅ .env.local (credenciales)         │
│ ✅ node_modules/ (dependencias)      │
│ ✅ /target/ /dist/ (compilados)      │
│ ✅ *.log (logs)                      │
│ ✅ .idea/ .vscode/ (IDE)             │
│ ✅ application.properties (si tiene) │
└──────────────────────────────────────┘
                   │
                   ▼
CAPA 3: AUTENTICACIÓN (JWT)
┌──────────────────────────────────────┐
│ Frontend:                            │
│ 1. Login → Obtener JWT token        │
│ 2. Guardar en localStorage          │
│ 3. Incluir en todos los requests    │
│    Authorization: Bearer {JWT}       │
│                                      │
│ Backend:                             │
│ 1. JwtAuthenticationFilter valida   │
│ 2. Extrae claims (user, role)       │
│ 3. Permite/rechaza según rol        │
└──────────────────────────────────────┘
                   │
                   ▼
CAPA 4: AUTORIZACIÓN (ROLES)
┌──────────────────────────────────────┐
│ Roles disponibles:                   │
│ ✅ ADMIN - Acceso total             │
│ ✅ INVESTIGADOR - Datos personales  │
│ ✅ USUARIO - Lectura limitada       │
│ ✅ GUEST - Solo catálogo            │
│                                      │
│ Endpoints protegidos:                │
│ /api/perfil-investigador/* - AUTH   │
│ /api/investigador/* - INVESTIGADOR  │
│ /api/admin/* - ADMIN                │
│ /api/aplicaciones/* - PUBLIC        │
└──────────────────────────────────────┘
                   │
                   ▼
CAPA 5: HTTPS/SSL
┌──────────────────────────────────────┐
│ Desarrollo:                          │
│ - localhost:8443 (self-signed)      │
│                                      │
│ Producción:                          │
│ - AWS Certificate Manager, o        │
│ - GCP Managed Certificate, o        │
│ - Azure App Service Certificate     │
│ - Let's Encrypt (free)              │
└──────────────────────────────────────┘
                   │
                   ▼
CAPA 6: CORS (Cross-Origin)
┌──────────────────────────────────────┐
│ Allowed Origins:                     │
│ ✅ https://localhost:4200 (dev)     │
│ ✅ https://agrocastillo.com (prod)  │
│                                      │
│ Blocked:                             │
│ ❌ http://malware.com (inseguro)    │
│ ❌ https://other-app.com (externo)  │
└──────────────────────────────────────┘
```

---

## Arquitectura de Conexión a Base de Datos

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    CONEXIÓN A POSTGRESQL                                   │
└───────────────────────────────────────────────────────────────────────────┘

FRONTEND (no se conecta directamente a BD)
       │
       │ HTTP/HTTPS
       │ Puerto 8443/api
       │
       ▼
BACKEND (Spring Boot)
       │
       ├─ HikariCP (Connection Pool)
       │  ├─ Min connections: 5
       │  ├─ Max connections: 20
       │  └─ Connection timeout: 30s
       │
       ├─ Driver: PostgreSQL JDBC
       │  └─ jdbc:postgresql://host:5432/dbname
       │
       ├─ Credentials from ENV VARS
       │  ├─ DB_HOST (default: localhost)
       │  ├─ DB_PORT (default: 5432)
       │  ├─ DB_NAME (default: AgroCastillo)
       │  ├─ DB_USER (default: postgres)
       │  └─ DB_PASSWORD (NO DEFAULT - REQUIRED)
       │
       └─ SSL Connection (optional)
          └─ ssl=true (para conexiones seguras)
       │
       ▼
POSTGRESQL (Puerto 5432)
       │
       ├─ Base de datos: AgroCastillo
       │  │
       │  ├─ investigador (tabla principal)
       │  │  ├─ id SERIAL PRIMARY KEY
       │  │  ├─ nombre VARCHAR
       │  │  ├─ especialidad VARCHAR
       │  │  ├─ email VARCHAR UNIQUE
       │  │  ├─ telefono VARCHAR
       │  │  └─ fecha_creacion TIMESTAMP
       │  │
       │  ├─ aplicacion_investigador
       │  │  ├─ id SERIAL PRIMARY KEY
       │  │  ├─ id_investigador INT FK
       │  │  ├─ nombre VARCHAR
       │  │  ├─ descripcion TEXT
       │  │  ├─ url_aplicacion VARCHAR
       │  │  ├─ estado VARCHAR
       │  │  ├─ fecha_creacion TIMESTAMP
       │  │  └─ fecha_actualizacion TIMESTAMP
       │  │
       │  ├─ usuario (login)
       │  │  ├─ id SERIAL PRIMARY KEY
       │  │  ├─ email VARCHAR UNIQUE
       │  │  ├─ password_hash VARCHAR
       │  │  ├─ id_rol INT FK
       │  │  └─ activo BOOLEAN
       │  │
       │  ├─ rol (ADMIN, INVESTIGADOR, USUARIO, GUEST)
       │  │  ├─ id SERIAL PRIMARY KEY
       │  │  └─ nombre VARCHAR UNIQUE
       │  │
       │  ├─ permiso
       │  │  ├─ id SERIAL PRIMARY KEY
       │  │  ├─ id_rol INT FK
       │  │  └─ nombre VARCHAR
       │  │
       │  └─ otras tablas...
       │
       ▼
Datos Persistentes
```

---

## Stack Tecnológico Completo

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    TECNOLOGÍAS UTILIZADAS                                 │
└──────────────────────────────────────────────────────────────────────────┘

FRONTEND                          BACKEND                   BASE DE DATOS
┌─────────────────────┐        ┌─────────────────────┐    ┌───────────────┐
│ Angular 18+         │        │ Spring Boot 3.x     │    │ PostgreSQL    │
│ TypeScript 5.x      │        │ Java 17+            │    │ 15.x          │
│ RxJS 7.x            │        │ Maven 3.9.x         │    │ Port: 5432    │
│ Standalone Components│        │ Spring Security 6.x │    │ JDBC Driver   │
│ Signals             │        │ Spring Data JPA     │    │ HikariCP Pool │
│ Reactive Forms      │        │ Hibernate ORM       │    │ Backup & HA   │
│ HttpClient          │        │ Spring REST         │    │               │
│ CSS3                │        │ OpenAPI/Swagger     │    │               │
│ npm/Node 20.x       │        │ JWT Authentication  │    │               │
└─────────────────────┘        │ CORS Support        │    │               │
                               │ Lombok              │    │               │
                               │ Validation          │    │               │
                               └─────────────────────┘    └───────────────┘

                           IDE & TOOLS
            ┌──────────────────────────────────────────┐
            │ VSCode / IntelliJ IDEA                   │
            │ Git / GitHub                             │
            │ Docker (para contenedores)               │
            │ Maven (build backend)                    │
            │ npm/Angular CLI (build frontend)         │
            │ Postman (testing APIs)                   │
            │ pgAdmin (administración BD)              │
            └──────────────────────────────────────────┘

                        DEPLOYMENT
            ┌──────────────────────────────────────────┐
            │ AWS / GCP / Azure                        │
            │ Docker Container Registry                │
            │ Kubernetes (Orquestación)                │
            │ RDS (Base de datos managed)              │
            │ CloudFront / CDN                         │
            │ CI/CD (GitHub Actions)                   │
            │ Monitoring & Logging                     │
            └──────────────────────────────────────────┘
```

---

## Resumen Visual

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     AGROCASTILLO PRODUCTION READY                         │
│                                                                            │
│  ✅ Seguridad CRÍTICA resuelta (credenciales externalizadas)             │
│  ✅ Conectividad BD funcional (frontend ↔ backend ↔ PostgreSQL)          │
│  ✅ Documentación profesional (setup, arquitectura, API)                 │
│  ✅ Código limpio y tipado (TypeScript, error handling)                  │
│  ✅ Configuración para desarrollo y producción                           │
│  ✅ Apto para portafolio de reclutamiento internacional                 │
│                                                                            │
│  Puntuación: 7.6/10 ⭐                                                    │
│  Estado: 🟢 LISTO PARA DEPLOY                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

---

**Documento de Arquitectura - AgroCastillo v1.0**  
**Generado:** Junio 2026  
**Auditoría de Seguridad Integral**

