package com.agrocastillo.backend.controller;

import com.agrocastillo.backend.dto.AplicacionInvestigadorDTO;
import com.agrocastillo.backend.entity.Usuario;
import com.agrocastillo.backend.repository.UsuarioRepository;
import com.agrocastillo.backend.service.AplicacionInvestigadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/investigador/aplicaciones")
@CrossOrigin(origins = "https://localhost:4200", allowCredentials = "true")
public class AplicacionInvestigadorController {

    private final AplicacionInvestigadorService aplicacionInvestigadorService;
    private final UsuarioRepository usuarioRepository;

    public AplicacionInvestigadorController(
            AplicacionInvestigadorService aplicacionInvestigadorService,
            UsuarioRepository usuarioRepository
    ) {
        this.aplicacionInvestigadorService = aplicacionInvestigadorService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<AplicacionInvestigadorDTO>> listar(
            Authentication authentication
    ) {
        Long idAutor = obtenerIdUsuarioAutenticado(authentication);

        return ResponseEntity.ok(
                aplicacionInvestigadorService.listarPorInvestigador(idAutor)
        );
    }

    @PostMapping
    public ResponseEntity<AplicacionInvestigadorDTO> crear(
            Authentication authentication,
            @RequestBody AplicacionInvestigadorDTO dto
    ) {
        Long idAutor = obtenerIdUsuarioAutenticado(authentication);

        return ResponseEntity.ok(
                aplicacionInvestigadorService.crear(idAutor, dto)
        );
    }

    @PutMapping("/{idAplicacion}")
    public ResponseEntity<AplicacionInvestigadorDTO> actualizar(
            Authentication authentication,
            @PathVariable @NonNull Long idAplicacion,
            @RequestBody AplicacionInvestigadorDTO dto
    ) {
        Long idAutor = obtenerIdUsuarioAutenticado(authentication);

        return ResponseEntity.ok(
                aplicacionInvestigadorService.actualizar(idAutor, idAplicacion, dto)
        );
    }

    @DeleteMapping("/{idAplicacion}")
    public ResponseEntity<Void> eliminar(
            Authentication authentication,
            @PathVariable @NonNull Long idAplicacion
    ) {
        Long idAutor = obtenerIdUsuarioAutenticado(authentication);

        aplicacionInvestigadorService.eliminarLogico(idAutor, idAplicacion);

        return ResponseEntity.noContent().build();
    }

    private Long obtenerIdUsuarioAutenticado(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("No hay usuario autenticado.");
        }

        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No existe un usuario registrado con el correo: " + email));

        return usuario.getId();
    }
}