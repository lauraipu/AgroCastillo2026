-- ============================================================
-- AGROCASTILLO SAMPLE DATA FOR TESTING
-- ============================================================
-- Insert sample data for development and testing
-- This file is optional and can be disabled in application.properties
-- ============================================================

-- ============================================================
-- INSERT SAMPLE USUARIOS
-- ============================================================
INSERT INTO usuarios (nombre, correo, contrasena, institucion, id_rol, id_ocupacion, orcid, cvlac, bio_academica, github, linkedin, avatar_url, activo, proveedor_oauth)
VALUES
    ('Juan Pérez', 'juan@example.com', '$2a$10$slYQmyNdGzin7olVZeUNnODn1R.Ei7k0w0DzG5PD9uGyTOJm6jqUK', 'Universidad Nacional', 2, 2, '0000-0001-2345-6789', 'A12345678901234567890', 'Investigador en sistemas agrícolas', 'github.com/juan', 'linkedin.com/in/juan', 'https://via.placeholder.com/150', true, 'LOCAL'),
    ('María García', 'maria@example.com', '$2a$10$slYQmyNdGzin7olVZeUNnODn1R.Ei7k0w0DzG5PD9uGyTOJm6jqUK', 'CIAT', 2, 3, '0000-0002-3456-7890', 'B12345678901234567890', 'Especialista en fitotecnia', 'github.com/maria', 'linkedin.com/in/maria', 'https://via.placeholder.com/150', true, 'LOCAL'),
    ('Carlos López', 'carlos@example.com', '$2a$10$slYQmyNdGzin7olVZeUNnODn1R.Ei7k0w0DzG5PD9uGyTOJm6jqUK', 'Universidad del Valle', 1, 1, NULL, NULL, 'Estudiante de agronomía', NULL, NULL, 'https://via.placeholder.com/150', true, 'LOCAL'),
    ('Admin User', 'admin@agrocastillo.p12.com', '$2a$10$slYQmyNdGzin7olVZeUNnODn1R.Ei7k0w0DzG5PD9uGyTOJm6jqUK', 'AgroCastillo', 3, NULL, NULL, NULL, 'Administrator del sistema', NULL, NULL, 'https://via.placeholder.com/150', true, 'LOCAL'),
    ('Sofía Rodríguez', 'sofia@example.com', '$2a$10$slYQmyNdGzin7olVZeUNnODn1R.Ei7k0w0DzG5PD9uGyTOJm6jqUK', 'ICA', 2, 2, '0000-0003-4567-8901', 'C12345678901234567890', 'Investigadora en análisis de suelos', 'github.com/sofia', 'linkedin.com/in/sofia', 'https://via.placeholder.com/150', true, 'LOCAL'),
    ('Luis Martínez', 'luis@example.com', '$2a$10$slYQmyNdGzin7olVZeUNnODn1R.Ei7k0w0DzG5PD9uGyTOJm6jqUK', NULL, 1, 4, NULL, NULL, 'Profesional independiente en agronomía', 'github.com/luis', NULL, 'https://via.placeholder.com/150', true, 'LOCAL'),
    ('Laura Sofía Ipuz', 'laura.sofiaipuz34@gmail.com', '$2a$10$slYQmyNdGzin7olVZeUNnODn1R.Ei7k0w0DzG5PD9uGyTOJm6jqUK', 'Universidad del Valle', 1, NULL, NULL, NULL, 'Usuaria de prueba', NULL, NULL, 'https://via.placeholder.com/150', true, 'LOCAL')
ON CONFLICT (correo) DO NOTHING;

-- ============================================================
-- INSERT SAMPLE APLICACIONES
-- ============================================================
INSERT INTO aplicaciones (nombre, descripcion, id_autor, institucion, version, url_descarga, url_doc, imagen_url, activa, descargas)
VALUES
    (
        'AgroAnalytics',
        'Plataforma de análisis de datos agrícolas con visualización avanzada y reportes automáticos para monitoreo de cultivos',
        (SELECT id_usuario FROM usuarios WHERE correo = 'juan@example.com'),
        'Universidad Nacional',
        '2.1.0',
        'https://github.com/agrocastillo.p12/agroanalytics/releases',
        'https://agroanalytics.readthedocs.io',
        'https://via.placeholder.com/300x200?text=AgroAnalytics',
        true,
        245
    ),
    (
        'SueloMapper',
        'Software especializado para mapeo y análisis de características de suelos mediante imágenes satelitales e IA',
        (SELECT id_usuario FROM usuarios WHERE correo = 'sofia@example.com'),
        'ICA',
        '1.5.2',
        'https://github.com/agrocastillo.p12/suelomapper/releases',
        'https://suelomapper.docs.io',
        'https://via.placeholder.com/300x200?text=SueloMapper',
        true,
        189
    ),
    (
        'CaféPro',
        'Herramienta completa para gestión de fincas cafetaleras, desde siembra hasta cosecha con análisis de rendimiento',
        (SELECT id_usuario FROM usuarios WHERE correo = 'maria@example.com'),
        'CIAT',
        '3.0.1',
        'https://github.com/agrocastillo.p12/cafepro/releases',
        'https://cafepro.readthedocs.io',
        'https://via.placeholder.com/300x200?text=CaféPro',
        true,
        412
    ),
    (
        'FitoOptimizer',
        'Aplicación de optimización de cultivos basada en machine learning y datos históricos agrícolas',
        (SELECT id_usuario FROM usuarios WHERE correo = 'juan@example.com'),
        'Universidad Nacional',
        '1.8.0',
        'https://github.com/agrocastillo.p12/fitooptimizer/releases',
        'https://fitooptimizer.docs.io',
        'https://via.placeholder.com/300x200?text=FitoOptimizer',
        true,
        156
    ),
    (
        'AgroStat Pro',
        'Suite estadística avanzada para análisis agrícolas con soporte para diseños experimentales complejos',
        (SELECT id_usuario FROM usuarios WHERE correo = 'sofia@example.com'),
        'ICA',
        '2.3.5',
        'https://github.com/agrocastillo.p12/agrostat/releases',
        'https://agrostat.readthedocs.io',
        'https://via.placeholder.com/300x200?text=AgroStat',
        true,
        324
    )
ON CONFLICT DO NOTHING;

-- ============================================================
-- INSERT SAMPLE APLICACION_CATEGORIA MAPPINGS
-- ============================================================
INSERT INTO aplicacion_categoria (id_aplicacion, id_categoria)
SELECT a.id_aplicacion, c.id_categoria FROM aplicaciones a, categorias c
WHERE a.nombre = 'AgroAnalytics' AND c.nombre = 'Análisis de datos'
ON CONFLICT DO NOTHING;

INSERT INTO aplicacion_categoria (id_aplicacion, id_categoria)
SELECT a.id_aplicacion, c.id_categoria FROM aplicaciones a, categorias c
WHERE a.nombre = 'AgroAnalytics' AND c.nombre = 'Estadística'
ON CONFLICT DO NOTHING;

INSERT INTO aplicacion_categoria (id_aplicacion, id_categoria)
SELECT a.id_aplicacion, c.id_categoria FROM aplicaciones a, categorias c
WHERE a.nombre = 'SueloMapper' AND c.nombre = 'Suelos'
ON CONFLICT DO NOTHING;

INSERT INTO aplicacion_categoria (id_aplicacion, id_categoria)
SELECT a.id_aplicacion, c.id_categoria FROM aplicaciones a, categorias c
WHERE a.nombre = 'SueloMapper' AND c.nombre = 'Análisis de datos'
ON CONFLICT DO NOTHING;

INSERT INTO aplicacion_categoria (id_aplicacion, id_categoria)
SELECT a.id_aplicacion, c.id_categoria FROM aplicaciones a, categorias c
WHERE a.nombre = 'CaféPro' AND c.nombre = 'Caficultura'
ON CONFLICT DO NOTHING;

INSERT INTO aplicacion_categoria (id_aplicacion, id_categoria)
SELECT a.id_aplicacion, c.id_categoria FROM aplicaciones a, categorias c
WHERE a.nombre = 'FitoOptimizer' AND c.nombre = 'Fitotecnia'
ON CONFLICT DO NOTHING;

INSERT INTO aplicacion_categoria (id_aplicacion, id_categoria)
SELECT a.id_aplicacion, c.id_categoria FROM aplicaciones a, categorias c
WHERE a.nombre = 'FitoOptimizer' AND c.nombre = 'Análisis de datos'
ON CONFLICT DO NOTHING;

INSERT INTO aplicacion_categoria (id_aplicacion, id_categoria)
SELECT a.id_aplicacion, c.id_categoria FROM aplicaciones a, categorias c
WHERE a.nombre = 'AgroStat Pro' AND c.nombre = 'Estadística'
ON CONFLICT DO NOTHING;

INSERT INTO aplicacion_categoria (id_aplicacion, id_categoria)
SELECT a.id_aplicacion, c.id_categoria FROM aplicaciones a, categorias c
WHERE a.nombre = 'AgroStat Pro' AND c.nombre = 'Análisis de datos'
ON CONFLICT DO NOTHING;

-- ============================================================
-- INSERT SAMPLE CALIFICACIONES
-- ============================================================
INSERT INTO calificaciones (id_aplicacion, id_usuario, puntuacion, comentario)
SELECT
    (SELECT id_aplicacion FROM aplicaciones WHERE nombre = 'AgroAnalytics'),
    (SELECT id_usuario FROM usuarios WHERE correo = 'carlos@example.com'),
    5,
    'Excelente herramienta, muy intuitiva y poderosa para análisis de cultivos'
ON CONFLICT DO NOTHING;

INSERT INTO calificaciones (id_aplicacion, id_usuario, puntuacion, comentario)
SELECT
    (SELECT id_aplicacion FROM aplicaciones WHERE nombre = 'AgroAnalytics'),
    (SELECT id_usuario FROM usuarios WHERE correo = 'luis@example.com'),
    4,
    'Muy buena, aunque la documentación podría ser más completa'
ON CONFLICT DO NOTHING;

INSERT INTO calificaciones (id_aplicacion, id_usuario, puntuacion, comentario)
SELECT
    (SELECT id_aplicacion FROM aplicaciones WHERE nombre = 'CaféPro'),
    (SELECT id_usuario FROM usuarios WHERE correo = 'carlos@example.com'),
    5,
    'Perfecta para mi finca de café. Ha mejorado mis cosechas significativamente'
ON CONFLICT DO NOTHING;

INSERT INTO calificaciones (id_aplicacion, id_usuario, puntuacion, comentario)
SELECT
    (SELECT id_aplicacion FROM aplicaciones WHERE nombre = 'SueloMapper'),
    (SELECT id_usuario FROM usuarios WHERE correo = 'luis@example.com'),
    5,
    'Los mapas de suelos son muy precisos'
ON CONFLICT DO NOTHING;

-- ============================================================
-- INSERT SAMPLE FAVORITOS
-- ============================================================
INSERT INTO favoritos (id_usuario, id_aplicacion)
SELECT
    (SELECT id_usuario FROM usuarios WHERE correo = 'carlos@example.com'),
    (SELECT id_aplicacion FROM aplicaciones WHERE nombre = 'AgroAnalytics')
ON CONFLICT DO NOTHING;

INSERT INTO favoritos (id_usuario, id_aplicacion)
SELECT
    (SELECT id_usuario FROM usuarios WHERE correo = 'luis@example.com'),
    (SELECT id_aplicacion FROM aplicaciones WHERE nombre = 'CaféPro')
ON CONFLICT DO NOTHING;

INSERT INTO favoritos (id_usuario, id_aplicacion)
SELECT
    (SELECT id_usuario FROM usuarios WHERE correo = 'luis@example.com'),
    (SELECT id_aplicacion FROM aplicaciones WHERE nombre = 'SueloMapper')
ON CONFLICT DO NOTHING;

-- ============================================================
-- INSERT SAMPLE HILOS_DISCUSION
-- ============================================================
INSERT INTO hilos_discusion (titulo, descripcion, id_autor, id_categoria, activo)
VALUES
    (
        '¿Mejores prácticas para análisis de suelos?',
        'Estoy buscando recomendaciones sobre cómo utilizar SueloMapper y herramientas complementarias para análisis completo de suelos agrícolas',
        (SELECT id_usuario FROM usuarios WHERE correo = 'luis@example.com'),
        (SELECT id_categoria FROM categorias WHERE nombre = 'Suelos'),
        true
    ),
    (
        'Comparativa de herramientas de análisis de datos agrícolas',
        'Cuáles consideran que son las mejores aplicaciones para análisis de datos en cultivos de café y cuáles son sus ventajas?',
        (SELECT id_usuario FROM usuarios WHERE correo = 'carlos@example.com'),
        (SELECT id_categoria FROM categorias WHERE nombre = 'Análisis de datos'),
        true
    ),
    (
        'Caso de uso: Optimización de rendimiento en caficultura',
        'Comparto nuestro caso de uso implementando CaféPro en una finca de 50 hectáreas',
        (SELECT id_usuario FROM usuarios WHERE correo = 'maria@example.com'),
        (SELECT id_categoria FROM categorias WHERE nombre = 'Caficultura'),
        true
    )
ON CONFLICT DO NOTHING;

-- ============================================================
-- INSERT SAMPLE COMENTARIOS
-- ============================================================
INSERT INTO comentarios (id_hilo, id_usuario, contenido, activo)
SELECT
    (SELECT id_hilo FROM hilos_discusion WHERE titulo = '¿Mejores prácticas para análisis de suelos?'),
    (SELECT id_usuario FROM usuarios WHERE correo = 'sofia@example.com'),
    'Recomiendo hacer análisis físicos y químicos. SueloMapper es excelente para las imágenes satelitales, pero siempre valida con muestras de laboratorio.',
    true
ON CONFLICT DO NOTHING;

INSERT INTO comentarios (id_hilo, id_usuario, contenido, activo)
SELECT
    (SELECT id_hilo FROM hilos_discusion WHERE titulo = '¿Mejores prácticas para análisis de suelos?'),
    (SELECT id_usuario FROM usuarios WHERE correo = 'juan@example.com'),
    'También recomiendo integrar AgroAnalytics para visualizar tendencias en el tiempo. Combinado con SueloMapper tienes un análisis muy completo.',
    true
ON CONFLICT DO NOTHING;

INSERT INTO comentarios (id_hilo, id_usuario, contenido, activo)
SELECT
    (SELECT id_hilo FROM hilos_discusion WHERE titulo = 'Comparativa de herramientas de análisis de datos agrícolas'),
    (SELECT id_usuario FROM usuarios WHERE correo = 'maria@example.com'),
    'En nuestro equipo usamos AgroAnalytics principalmente. La curva de aprendizaje es corta y los reportes se generan automáticamente.',
    true
ON CONFLICT DO NOTHING;

-- ============================================================
-- INSERT SAMPLE REPORTES (MODERATION)
-- ============================================================
-- Sample report for demonstration (all fields properly populated)
INSERT INTO reportes (tipo_reporte, id_elemento, motivo, id_reportador, estado)
VALUES
    (
        'contenido',
        (SELECT id_hilo FROM hilos_discusion LIMIT 1),
        'Posible spam o contenido irrelevante',
        (SELECT id_usuario FROM usuarios WHERE correo = 'admin@agrocastillo.p12.com'),
        'revisado'
    )
ON CONFLICT DO NOTHING;

-- ============================================================
-- COMMIT & VERIFY
-- ============================================================
COMMIT;
