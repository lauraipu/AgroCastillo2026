package com.agrocastillo.backend.repository;

import com.agrocastillo.backend.dto.InvestigadorPublicoProjection;
import com.agrocastillo.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query(
            value = """
                SELECT
                    u.id AS id,
                    u.nombre AS nombre,
                    u.email AS correo,
                    u.rol AS rol,
                    '' AS "cvlacUrl",
                    COALESCE(u.orcid, '') AS orcid
                FROM usuarios u
                WHERE UPPER(u.rol) = 'INVESTIGADOR'
                   OR UPPER(u.rol) = 'ROLE_INVESTIGADOR'
                   OR UPPER(u.rol) LIKE '%INVESTIGADOR%'
                ORDER BY u.nombre ASC
                """,
            nativeQuery = true
    )
    List<InvestigadorPublicoProjection> listarInvestigadoresPublicos();
}