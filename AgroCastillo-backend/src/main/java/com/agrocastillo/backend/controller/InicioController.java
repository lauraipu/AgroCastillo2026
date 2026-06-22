package com.agrocastillo.backend.controller;

import com.agrocastillo.backend.dto.InicioStatsDTO;
import com.agrocastillo.backend.repository.AplicacionRepository;
import com.agrocastillo.backend.repository.HiloDiscusionRepository;
import com.agrocastillo.backend.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inicio")
@CrossOrigin(origins = "https://localhost:4200")
public class InicioController {

    private final UsuarioRepository usuarioRepository;
    private final AplicacionRepository aplicacionRepository;
    private final HiloDiscusionRepository hiloDiscusionRepository;

    public InicioController(
            UsuarioRepository usuarioRepository,
            AplicacionRepository aplicacionRepository,
            HiloDiscusionRepository hiloDiscusionRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.aplicacionRepository = aplicacionRepository;
        this.hiloDiscusionRepository = hiloDiscusionRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<InicioStatsDTO> obtenerEstadisticasInicio() {
        long usuariosRegistrados = usuarioRepository.count();
        long aplicaciones = aplicacionRepository.count();
        long hilos = hiloDiscusionRepository.count();
        long lineas = 3;

        InicioStatsDTO stats = new InicioStatsDTO(
                usuariosRegistrados,
                aplicaciones,
                hilos,
                lineas
        );

        return ResponseEntity.ok(stats);
    }
}