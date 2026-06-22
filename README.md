# 🌾 **AgroCastillo** - Plataforma de Investigación Agrícola Colaborativa

![Status](https://img.shields.io/badge/Status-Development-yellow?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Angular](https://img.shields.io/badge/Angular-21.2.0-red?style=flat-square)
![Spring%20Boot](https://img.shields.io/badge/Spring%20Boot-3.5.14-brightgreen?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12%2B-336791?style=flat-square)

---

## 📋 **Descripción del Proyecto**

**AgroCastillo** es una plataforma digital diseñada para facilitar la **investigación colaborativa en el sector agrícola**. Conecta investigadores, estudiantes y profesionales del agro en un ecosistema donde pueden:

- 📱 Compartir aplicaciones y herramientas de investigación
- 👥 Colaborar en comunidades temáticas
- 📊 Acceder a un catálogo de aplicaciones agrícolas
- 🔬 Publicar y gestionar perfiles de investigadores
- 📈 Administrar dashboards de estadísticas

### 🎯 **Público Objetivo**
- Investigadores agrícolas
- Estudiantes de agronomía
- Profesionales del sector agropecuario
- Instituciones académicas especializadas

---

## 🛠️ **Stack Tecnológico**

### **Frontend**
- **Angular** 21.2.0 - Framework web moderno
- **TypeScript** 5.9.2 - Lenguaje tipado
- **Bootstrap** 5.3.8 - Diseño responsivo
- **TailwindCSS** 4.3.0 - Utilidades CSS
- **RxJS** 7.8.0 - Programación reactiva
- **ngx-translate** 17.0.0 - Internacionalización
- **Leaflet** 1.9.4 - Mapas interactivos

### **Backend**
- **Spring Boot** 3.5.14 - Framework Java
- **Java** 21 - Lenguaje de programación
- **JPA/Hibernate** - ORM
- **Spring Security** - Autenticación y autorización
- **JWT** (jjwt 0.12.5) - Tokens seguros
- **Spring Data** - Acceso a datos
- **Spring Actuator** - Monitoreo

### **Base de Datos**
- **PostgreSQL** 12+ - Base de datos relacional
- **SQL** - Queries optimizadas

### **DevOps & Tools**
- **Maven** 3.9+ - Gestor de dependencias Java
- **npm** 11.9.0 - Gestor de paquetes Node
- **Git** - Control de versiones
- **Docker** - Containerización (próximamente)

---

## ⚙️ **Requisitos Previos**

Antes de clonar el proyecto, asegúrate de tener instalados:

### **Obligatorio**
| Herramienta | Versión | Descripción |
|------------|---------|------------|
| **Node.js** | 18+ | Runtime para npm |
| **Java JDK** | 21 | Compilador y runtime Java |
| **PostgreSQL** | 12+ | Base de datos |
| **Git** | 2.0+ | Control de versiones |

### **Recomendado**
| Herramienta | Propósito |
|------------|----------|
| **VS Code** | Editor de código |
| **IntelliJ IDEA** | IDE para Java (Community Edition) |
| **Postman** | Pruebas de API |
| **pgAdmin** | Administración de PostgreSQL |

### **Verificar instalación**
```bash
# Node.js y npm
node --version  # v18.0.0 o superior
npm --version   # 9.0.0 o superior

# Java
java -version   # openjdk 21 o similar

# PostgreSQL
psql --version  # PostgreSQL 12+

# Git
git --version   # git version 2.0+
```

---

## 🚀 **Instalación y Setup Local**

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/lauraipu/AgroCastillo.git
cd AgroCastillo
```

### **2. Configurar Variables de Entorno**

Copiar el archivo de ejemplo y crear tu `.env` local:

```bash
cp .env.example .env
```

Editar `.env` con tus valores locales:
```env
DB_URL=jdbc:postgresql://localhost:5432/AgroCastillo
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña_segura

JWT_SECRET=tu_clave_jwt_segura_aqui

GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

FRONTEND_URL=https://localhost:4200
```

> ⚠️ **IMPORTANTE:** Nunca hacer commit del archivo `.env` (está en `.gitignore`)

### **3. Crear Base de Datos PostgreSQL**

```bash
# Conectar a PostgreSQL
psql -U postgres

# En la terminal psql:
CREATE DATABASE "AgroCastillo" ENCODING 'UTF8';

# (Opcional) Crear usuario especial
CREATE USER agrocastillo WITH PASSWORD 'contraseña_segura';
GRANT ALL PRIVILEGES ON DATABASE "AgroCastillo" TO agrocastillo;
```

### **4. Setup del Backend (Spring Boot)**

```bash
# Navegar a la carpeta backend
cd AgroCastillo-backend

# Compilar y ejecutar
mvn clean install
mvn spring-boot:run

# El backend estará disponible en:
# https://localhost:8443/api
# Swagger UI: https://localhost:8443/api/swagger-ui.html
```

#### Verificar que el backend inicie correctamente
```bash
# La consola debe mostrar:
# - "Started AgroCastilloApplication in X.XXX seconds"
# - "Tomcat started on port(s): 8443 (https)"
```

### **5. Setup del Frontend (Angular)**

```bash
# Navegar a la carpeta frontend
cd AgroCastillo-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# O usando ng directamente
ng serve

# La aplicación estará disponible en:
# https://localhost:4200
```

#### Verificar que Angular inicie correctamente
```bash
# La consola debe mostrar:
# - "Application bundle generation complete"
# - "Initial Chunk Files | Names | Raw Size"
```

---

## 📁 **Estructura del Proyecto**

```
AgroCastillo/
│
├── 📂 AgroCastillo-backend/          ← Backend Spring Boot Java
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/agrocastillo/backend/
│   │   │   │   ├── config/              ← Configuración (Security, JWT)
│   │   │   │   ├── controller/          ← REST Endpoints
│   │   │   │   ├── service/             ← Lógica de negocio
│   │   │   │   ├── repository/          ← Acceso a datos (JPA)
│   │   │   │   ├── entity/              ← Modelos de BD
│   │   │   │   ├── dto/                 ← Data Transfer Objects
│   │   │   │   ├── exception/           ← Excepciones personalizadas
│   │   │   │   └── security/            ← Componentes de seguridad
│   │   │   └── resources/
│   │   │       ├── application.properties  ← Configuración Spring
│   │   │       ├── schema.sql              ← Esquema de BD
│   │   │       ├── data.sql                ← Datos de prueba
│   │   │       └── agrocastillo.p12        ← Certificado SSL
│   │   └── test/                      ← Tests unitarios
│   ├── pom.xml                        ← Dependencias Maven
│   └── mvnw                           ← Maven wrapper
│
├── 📂 AgroCastillo-frontend/          ← Frontend Angular TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/            ← Componentes reutilizables
│   │   │   ├── guards/                ← Route Guards
│   │   │   ├── interceptors/          ← HTTP Interceptors
│   │   │   ├── models/                ← Tipos e interfaces
│   │   │   ├── pages/                 ← Páginas principales
│   │   │   ├── services/              ← Servicios inyectables
│   │   │   └── shared/                ← Módulos compartidos
│   │   ├── assets/                    ← Imágenes, estilos
│   │   ├── environments/              ← Configuración por entorno
│   │   ├── index.html                 ← HTML principal
│   │   └── main.ts                    ← Punto de entrada
│   ├── angular.json                   ← Configuración Angular
│   ├── package.json                   ← Dependencias npm
│   ├── tsconfig.json                  ← Configuración TypeScript
│   └── tailwind.config.js             ← Configuración TailwindCSS
│
├── 📄 .env.example                    ← Variables de entorno (ejemplo)
├── 📄 .gitignore                      ← Archivos ignorados por Git
├── 📄 README.md                       ← Este archivo
└── 📄 .instructions.md                ← Instrucciones personalizadas
```

---

## 🔗 **Endpoints Principales de la API**

### **Autenticación**
```
POST   /api/auth/login          - Login con credenciales
POST   /api/auth/register       - Registro de nuevo usuario
GET    /api/auth/oauth2/success - Callback de OAuth2 Google
```

### **Usuarios**
```
GET    /api/usuarios/perfil     - Obtener perfil del usuario
PUT    /api/usuarios/perfil     - Actualizar perfil
DELETE /api/usuarios/perfil     - Desactivar cuenta
```

### **Investigadores**
```
GET    /api/perfil-investigador/perfil  - Perfil del investigador
PUT    /api/perfil-investigador/perfil  - Actualizar perfil investigador
GET    /investigadores                  - Listar investigadores públicos
```

### **Aplicaciones**
```
GET    /api/investigador/aplicaciones        - Mis aplicaciones
POST   /api/investigador/aplicaciones        - Crear aplicación
PUT    /api/investigador/aplicaciones/:id    - Actualizar aplicación
DELETE /api/investigador/aplicaciones/:id    - Eliminar aplicación
GET    /api/aplicaciones                     - Catálogo público
```

### **Comunidad**
```
GET    /api/comunidad/hilos         - Listar hilos de discusión
POST   /api/comunidad/hilos         - Crear hilo
POST   /api/comunidad/comentarios   - Comentar en hilo
```

### **Admin**
```
GET    /api/admin/dashboard  - Dashboard de administración
GET    /api/admin/usuarios   - Listar usuarios
DELETE /api/admin/usuarios   - Eliminar usuario
```

---

## 🔐 **Seguridad**

### **Autenticación**
- ✅ **JWT (JSON Web Tokens)** con expiración de 24 horas
- ✅ **OAuth2** integración con Google
- ✅ **BCrypt** para hash de contraseñas
- ✅ **CORS** restringido a origen frontend

### **Conexión**
- ✅ **HTTPS/SSL** obligatorio en producción
- ✅ **Variables de entorno** para credenciales sensibles
- ✅ **Spring Security** configurado con filtros JWT

### **Best Practices Implementadas**
- ✅ No exponer credenciales en código
- ✅ Validación de entrada en todos los DTOs
- ✅ Manejo centralizado de excepciones
- ✅ Rate limiting (próximamente)

---

## 🧪 **Testing**

### **Backend**
```bash
cd AgroCastillo-backend
mvn test
```

### **Frontend**
```bash
cd AgroCastillo-frontend
npm test
ng test
```

---

## 🌍 **Internacionalización (i18n)**

El proyecto soporta múltiples idiomas mediante **ngx-translate**:
- 🇪🇸 **Español** (es)
- 🇬🇧 **Inglés** (en)
- 🇮🇹 **Italiano** (it)
- 🇫🇷 **Francés** (fr)

Archivos de traducciones: `/public/assets/i18n/`

```typescript
// Cambiar idioma en el frontend:
this.translate.use('es');  // Español
this.translate.use('en');  // Inglés
```

---

## 📊 **Arquitectura**

### **Diagrama de Flujo de Autenticación**
```
Usuario
  ↓
Login/Register (AuthController)
  ↓
AuthService (valida credenciales)
  ↓
JwtService (genera token)
  ↓
Token enviado al Frontend
  ↓
Frontend almacena en localStorage
  ↓
Cada request incluye token en header Authorization
  ↓
JwtAuthenticationFilter valida token
  ↓
Acceso a recursos protegidos ✅
```

### **Diagrama de Entidades BD**
```
usuarios (id, email, password, rol, orcid, ...)
  ├── roles (id_rol, nombre)
  ├── investigadores_perfil (info adicional)
  └── aplicaciones (id_app, id_autor, nombre, ...)
        ├── aplicacion_categoria
        └── categorias

comunidad/
  ├── hilos_discusion
  └── comentarios

admin/
  └── estadisticas
```

---

## 🚢 **Deployment/Producción**

### **Pre-requisitos para Producción**
- [ ] Cambiar todas las contraseñas por defecto
- [ ] Usar certificado SSL válido (Let's Encrypt)
- [ ] Configurar variables de entorno en servidor
- [ ] Realizar backup de BD
- [ ] Implementar logs centralizados
- [ ] Configurar CI/CD (GitHub Actions)

### **Docker (Próximamente)**
```bash
# Build de la aplicación
docker-compose build

# Ejecutar en contenedores
docker-compose up -d
```

---

## 🤝 **Contribución**

Para contribuir al proyecto:

1. **Fork** el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/AmazingFeature`
3. Commit tus cambios: `git commit -m 'Add some AmazingFeature'`
4. Push a la rama: `git push origin feature/AmazingFeature`
5. Abre un **Pull Request**

### **Convenciones de Código**
- TypeScript: `camelCase` para variables, `PascalCase` para clases
- Java: `camelCase` para variables, `PascalCase` para clases
- Commits: formato convencional (`feat:`, `fix:`, `docs:`, etc.)

---

## 📄 **Licencia**

Este proyecto está bajo la licencia **MIT**. Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 **Autores**

- **Laura Ipu** - Desarrolladora Principal
- Equipo de AgroCastillo

---

## 📞 **Soporte y Contacto**

- 📧 Email: info@agrocastillo.com
- 🐛 Reportar bugs: [GitHub Issues](https://github.com/lauraipu/AgroCastillo/issues)
- 💬 Discusiones: [GitHub Discussions](https://github.com/lauraipu/AgroCastillo/discussions)

---

## 🔄 **Hoja de Ruta (Roadmap)**

- [ ] Integración con sistema de calificaciones
- [ ] Descarga de aplicaciones
- [ ] Estadísticas avanzadas
- [ ] Notificaciones en tiempo real
- [ ] Dockerización completa
- [ ] CI/CD con GitHub Actions
- [ ] Implementar Redis para caché
- [ ] Mobile app (React Native)

---

## ✨ **Agradecimientos**

Gracias a todos los investigadores y colaboradores que hacen posible AgroCastillo.

---

**Última actualización:** 2026-06-11  
**Versión del Proyecto:** 0.0.1 (Development)

---

> 💡 **Nota:** Para auditoría completa de seguridad y recomendaciones, consulta `.instructions.md`
