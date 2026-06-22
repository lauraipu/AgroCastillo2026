package com.agrocastillo.backend.controller;

import com.agrocastillo.backend.dto.AplicacionCatalogoDTO;
import com.agrocastillo.backend.service.AplicacionCatalogoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aplicaciones")
@CrossOrigin(origins = "https://localhost:4200", allowCredentials = "true")
public class AplicacionCatalogoController {

    private final AplicacionCatalogoService aplicacionCatalogoService;

    public AplicacionCatalogoController(AplicacionCatalogoService aplicacionCatalogoService) {
        this.aplicacionCatalogoService = aplicacionCatalogoService;
    }

    @GetMapping
    public ResponseEntity<List<AplicacionCatalogoDTO>> listarAplicaciones() {
        return ResponseEntity.ok(
                aplicacionCatalogoService.listarAplicacionesActivas()
        );
    }
}
