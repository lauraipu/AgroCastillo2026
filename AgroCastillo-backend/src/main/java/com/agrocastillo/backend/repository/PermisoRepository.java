package com.agrocastillo.backend.repository;

import com.agrocastillo.backend.entity.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermisoRepository extends JpaRepository<Permiso, Long> {

    Optional<Permiso> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}