package com.agrocastillo.backend.controller;

import com.agrocastillo.backend.dto.ComentarioHiloDTO;
import com.agrocastillo.backend.dto.HiloDiscusionDTO;
import com.agrocastillo.backend.service.ComunidadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comunidad")
@CrossOrigin(origins = "https://localhost:4200")
public class ComunidadController {

    private final ComunidadService comunidadService;

    public ComunidadController(ComunidadService comunidadService) {
        this.comunidadService = comunidadService;
    }

    @GetMapping("/hilos")
    public ResponseEntity<List<HiloDiscusionDTO>> listarHilos() {
        return ResponseEntity.ok(comunidadService.listarHilos());
    }

    @GetMapping("/hilos/{idHilo}")
    public ResponseEntity<HiloDiscusionDTO> obtenerHiloPorId(@PathVariable Integer idHilo) {
        return ResponseEntity.ok(comunidadService.obtenerHiloPorId(idHilo));
    }

    @PostMapping("/hilos")
    public ResponseEntity<HiloDiscusionDTO> crearHilo(@RequestBody HiloDiscusionDTO dto) {
        return ResponseEntity.ok(comunidadService.crearHilo(dto));
    }

    @GetMapping("/hilos/{idHilo}/comentarios")
    public ResponseEntity<List<ComentarioHiloDTO>> listarComentariosPorHilo(@PathVariable Integer idHilo) {
        return ResponseEntity.ok(comunidadService.listarComentariosPorHilo(idHilo));
    }

    @PostMapping("/hilos/{idHilo}/comentarios")
    public ResponseEntity<ComentarioHiloDTO> crearComentarioEnHilo(
            @PathVariable Integer idHilo,
            @RequestBody ComentarioHiloDTO dto
    ) {
        return ResponseEntity.ok(comunidadService.crearComentarioEnHilo(idHilo, dto));
    }
}