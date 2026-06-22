package com.agrocastillo.backend.controller;

import com.agrocastillo.backend.dto.InvestigadorPublicoDTO;
import com.agrocastillo.backend.service.InvestigadorPublicoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/investigadores")
@CrossOrigin(origins = "https://localhost:4200", allowCredentials = "true")
public class InvestigadorPublicoController {

    private final InvestigadorPublicoService investigadorPublicoService;

    public InvestigadorPublicoController(InvestigadorPublicoService investigadorPublicoService) {
        this.investigadorPublicoService = investigadorPublicoService;
    }

    @GetMapping
    public ResponseEntity<List<InvestigadorPublicoDTO>> listarInvestigadores() {
        return ResponseEntity.ok(
                investigadorPublicoService.listarInvestigadores()
        );
    }
}