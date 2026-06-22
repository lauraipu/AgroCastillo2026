package com.agrocastillo.backend.repository;

import com.agrocastillo.backend.dto.AplicacionCatalogoProjection;
import com.agrocastillo.backend.entity.Aplicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AplicacionRepository extends JpaRepository<Aplicacion, Long> {

    List<Aplicacion> findByIdAutorOrderByFechaActualizacionDesc(Long idAutor);

    List<Aplicacion> findByIdAutorAndEstadoNotOrderByFechaActualizacionDesc(
            Long idAutor,
            String estado
    );

    List<Aplicacion> findByEstadoOrderByFechaActualizacionDesc(String estado);

    @Query(
            value = """
                    SELECT
                        a.id_app AS id,
                        a.nombre AS nombre,
                        a.descripcion AS descripcion,
                        a.url_aplicacion AS urlAplicacion,
                        a.estado AS estado,
                        u.nombre AS investigadorPrincipal,
                        COALESCE(
                            STRING_AGG(c.nombre, ', ' ORDER BY c.nombre),
                            'Sin categoría'
                        ) AS categorias
                    FROM aplicaciones a
                    INNER JOIN usuarios u
                        ON u.id = a.id_autor
                    LEFT JOIN aplicacion_categoria ac
                        ON ac.id_aplicacion = a.id_app
                    LEFT JOIN categorias c
                        ON c.id_categoria = ac.id_categoria
                    WHERE a.estado = 'activo'
                    GROUP BY
                        a.id_app,
                        a.nombre,
                        a.descripcion,
                        a.url_aplicacion,
                        a.estado,
                        u.nombre,
                        a.fecha_actualizacion
                    ORDER BY a.fecha_actualizacion DESC
                    """,
            nativeQuery = true
    )
    List<AplicacionCatalogoProjection> listarCatalogoAplicacionesActivas();
}