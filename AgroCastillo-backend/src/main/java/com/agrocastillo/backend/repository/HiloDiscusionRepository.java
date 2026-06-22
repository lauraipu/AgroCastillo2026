package com.agrocastillo.backend.repository;

import com.agrocastillo.backend.entity.HiloDiscusion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HiloDiscusionRepository extends JpaRepository<HiloDiscusion, Integer> {

    List<HiloDiscusion> findAllByOrderByFechaCreacionDesc();
}