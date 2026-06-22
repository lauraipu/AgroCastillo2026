package com.agrocastillo.backend.repository;

import com.agrocastillo.backend.entity.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {

    List<Comentario> findByIdHiloOrderByFechaComentarioAsc(Integer idHilo);

    List<Comentario> findByIdAppOrderByFechaComentarioAsc(Integer idApp);
}