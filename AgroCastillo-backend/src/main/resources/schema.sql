-- ============================================================
-- AGROCASTILLO DATABASE INITIALIZATION SCRIPT v1.0
-- ============================================================
-- This script initializes all tables and relationships
-- Database: agrocastillo_db
-- PostgreSQL 12+
-- ============================================================

-- ============================================================
-- 1. ROLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE CHECK (nombre IN ('USUARIO', 'INVESTIGADOR', 'ADMIN')),
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. PERMISOS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS permisos (
    id_permiso SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. ROL_PERMISO MAPPING TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS rol_permiso (
    id_rol INTEGER NOT NULL,
    id_permiso INTEGER NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_permiso) REFERENCES permisos(id_permiso) ON DELETE CASCADE
);

-- ============================================================
-- 4. OCUPACIONES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS ocupaciones (
    id_ocupacion SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE CHECK (nombre IN ('estudiante', 'docente', 'investigador', 'independiente')),
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. USUARIOS TABLE (MAIN)
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255),
    institucion VARCHAR(150),
    id_rol INTEGER NOT NULL,
    id_ocupacion INTEGER,
    orcid VARCHAR(50),
    cvlac VARCHAR(150),
    bio_academica TEXT,
    github VARCHAR(100),
    linkedin VARCHAR(100),
    avatar_url VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ultima_conexion TIMESTAMP,
    proveedor_oauth VARCHAR(50),
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol),
    FOREIGN KEY (id_ocupacion) REFERENCES ocupaciones(id_ocupacion)
);

-- ============================================================
-- 6. CATEGORIAS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE CHECK (nombre IN (
        'Análisis de datos',
        'Agroindustria',
        'Fitotecnia',
        'Estadística',
        'Suelos',
        'Caficultura',
        'Otro'
    )),
    descripcion TEXT,
    icono VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. APLICACIONES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS aplicaciones (
    id_aplicacion SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    id_autor INTEGER NOT NULL,
    institucion VARCHAR(150),
    version VARCHAR(20) DEFAULT '1.0.0',
    url_descarga VARCHAR(255),
    url_doc VARCHAR(255),
    imagen_url VARCHAR(255),
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT true,
    descargas INTEGER DEFAULT 0,
    FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- ============================================================
-- 8. APLICACION_CATEGORIA MAPPING
-- ============================================================
CREATE TABLE IF NOT EXISTS aplicacion_categoria (
    id_aplicacion INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    PRIMARY KEY (id_aplicacion, id_categoria),
    FOREIGN KEY (id_aplicacion) REFERENCES aplicaciones(id_aplicacion) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE
);

-- ============================================================
-- 9. CALIFICACIONES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS calificaciones (
    id_calificacion SERIAL PRIMARY KEY,
    id_aplicacion INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    puntuacion INTEGER NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_aplicacion, id_usuario),
    FOREIGN KEY (id_aplicacion) REFERENCES aplicaciones(id_aplicacion) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- ============================================================
-- 10. FAVORITOS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_aplicacion INTEGER NOT NULL,
    fecha_favorito TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_usuario, id_aplicacion),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_aplicacion) REFERENCES aplicaciones(id_aplicacion) ON DELETE CASCADE
);

-- ============================================================
-- 11. HILOS_DISCUSION TABLE (Community Forum)
-- ============================================================
CREATE TABLE IF NOT EXISTS hilos_discusion (
    id_hilo SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    id_autor INTEGER NOT NULL,
    id_categoria INTEGER,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL
);

-- ============================================================
-- 12. COMENTARIOS TABLE (Thread Responses)
-- ============================================================
CREATE TABLE IF NOT EXISTS comentarios (
    id_comentario SERIAL PRIMARY KEY,
    id_hilo INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    contenido TEXT NOT NULL,
    fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    FOREIGN KEY (id_hilo) REFERENCES hilos_discusion(id_hilo) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- ============================================================
-- 13. REPORTES TABLE (Moderation)
-- ============================================================
CREATE TABLE IF NOT EXISTS reportes (
    id_reporte SERIAL PRIMARY KEY,
    tipo_reporte VARCHAR(50) NOT NULL CHECK (tipo_reporte IN ('contenido', 'usuario', 'aplicacion')),
    id_elemento INTEGER,
    motivo TEXT NOT NULL,
    id_reportador INTEGER,
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'revisado', 'resuelto')),
    FOREIGN KEY (id_reportador) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_usuarios_id_rol ON usuarios(id_rol);
CREATE INDEX idx_usuarios_id_ocupacion ON usuarios(id_ocupacion);
CREATE INDEX idx_aplicaciones_id_autor ON aplicaciones(id_autor);
CREATE INDEX idx_aplicaciones_activa ON aplicaciones(activa);
CREATE INDEX idx_calificaciones_id_aplicacion ON calificaciones(id_aplicacion);
CREATE INDEX idx_calificaciones_id_usuario ON calificaciones(id_usuario);
CREATE INDEX idx_favoritos_id_usuario ON favoritos(id_usuario);
CREATE INDEX idx_hilos_discusion_id_autor ON hilos_discusion(id_autor);
CREATE INDEX idx_hilos_discusion_id_categoria ON hilos_discusion(id_categoria);
CREATE INDEX idx_comentarios_id_hilo ON comentarios(id_hilo);
CREATE INDEX idx_comentarios_id_usuario ON comentarios(id_usuario);

-- ============================================================
-- INSERT INITIAL DATA
-- ============================================================

-- Insert Roles
INSERT INTO roles (nombre, descripcion) VALUES
    ('USUARIO', 'Usuario regular de la plataforma - puede ver, comentar y valorar'),
    ('INVESTIGADOR', 'Investigador - puede publicar aplicaciones y gestionar perfil académico'),
    ('ADMIN', 'Administrador de la plataforma - puede moderar y gestionar usuarios')
ON CONFLICT (nombre) DO NOTHING;

-- Insert Permisos
INSERT INTO permisos (nombre, descripcion) VALUES
    ('ver_aplicaciones', 'Explorar aplicaciones publicadas'),
    ('comentar', 'Dejar comentarios en aplicaciones y foro'),
    ('calificar', 'Calificar aplicaciones'),
    ('favoritos', 'Guardar aplicaciones en favoritos'),
    ('participar_comunidad', 'Participar en foro académico'),
    ('ver_investigadores', 'Ver perfiles de investigadores'),
    ('publicar_aplicaciones', 'Publicar nuevas aplicaciones'),
    ('editar_perfil_academico', 'Editar perfil con ORCID y CvLAC'),
    ('subir_documentacion', 'Subir documentación académica'),
    ('gestionar_publicaciones', 'Gestionar aplicaciones publicadas'),
    ('moderar_contenido', 'Moderar contenido de la plataforma'),
    ('eliminar_reportes', 'Gestionar reportes de usuarios'),
    ('gestionar_usuarios', 'Gestionar cuentas de usuarios'),
    ('acceso_admin', 'Acceso al panel administrativo')
ON CONFLICT (nombre) DO NOTHING;

-- Insert Ocupaciones
INSERT INTO ocupaciones (nombre, descripcion) VALUES
    ('estudiante', 'Estudiante de pregrado o posgrado'),
    ('docente', 'Profesor o docente universitario'),
    ('investigador', 'Investigador independiente o de institución'),
    ('independiente', 'Profesional independiente')
ON CONFLICT (nombre) DO NOTHING;

-- Insert Categorias
INSERT INTO categorias (nombre, descripcion, icono) VALUES
    ('Análisis de datos', 'Herramientas para análisis e interpretación de datos', '📊'),
    ('Agroindustria', 'Tecnologías para agroindustria y transformación', '🏭'),
    ('Fitotecnia', 'Software para mejoramiento y técnicas de cultivo', '🌾'),
    ('Estadística', 'Herramientas estadísticas y modelado', '📈'),
    ('Suelos', 'Análisis y manejo de suelos agrícolas', '🌱'),
    ('Caficultura', 'Tecnologías específicas para café', '☕'),
    ('Otro', 'Otras categorías agrícolas y académicas', '🔧')
ON CONFLICT (nombre) DO NOTHING;

-- ============================================================
-- MAP ROLE TO PERMISSIONS
-- ============================================================

-- USUARIO permissions
INSERT INTO rol_permiso (id_rol, id_permiso) 
SELECT r.id_rol, p.id_permiso FROM roles r, permisos p 
WHERE r.nombre = 'USUARIO' AND p.nombre IN (
    'ver_aplicaciones', 'comentar', 'calificar', 'favoritos', 
    'participar_comunidad', 'ver_investigadores'
)
ON CONFLICT DO NOTHING;

-- INVESTIGADOR permissions (includes USUARIO permissions + extra)
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso FROM roles r, permisos p
WHERE r.nombre = 'INVESTIGADOR' AND p.nombre IN (
    'ver_aplicaciones', 'comentar', 'calificar', 'favoritos', 
    'participar_comunidad', 'ver_investigadores',
    'publicar_aplicaciones', 'editar_perfil_academico', 
    'subir_documentacion', 'gestionar_publicaciones'
)
ON CONFLICT DO NOTHING;

-- ADMIN permissions (all permissions)
INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso FROM roles r, permisos p
WHERE r.nombre = 'ADMIN'
ON CONFLICT DO NOTHING;

-- ============================================================
-- COMMIT & VERIFY
-- ============================================================
COMMIT;
