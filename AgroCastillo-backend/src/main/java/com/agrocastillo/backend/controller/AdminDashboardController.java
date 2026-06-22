package com.agrocastillo.backend.controller;

import com.agrocastillo.backend.dto.AdminHiloDTO;
import com.agrocastillo.backend.dto.AdminStatsDTO;
import com.agrocastillo.backend.dto.AdminUsuarioDTO;
import com.agrocastillo.backend.entity.HiloDiscusion;
import com.agrocastillo.backend.entity.Usuario;
import com.agrocastillo.backend.repository.AplicacionRepository;
import com.agrocastillo.backend.repository.ComentarioRepository;
import com.agrocastillo.backend.repository.HiloDiscusionRepository;
import com.agrocastillo.backend.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/dashboard")
@CrossOrigin(origins = "https://localhost:4200")
public class AdminDashboardController {

    private final UsuarioRepository usuarioRepository;
    private final AplicacionRepository aplicacionRepository;
    private final HiloDiscusionRepository hiloDiscusionRepository;
    private final ComentarioRepository comentarioRepository;

    public AdminDashboardController(
            UsuarioRepository usuarioRepository,
            AplicacionRepository aplicacionRepository,
            HiloDiscusionRepository hiloDiscusionRepository,
            ComentarioRepository comentarioRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.aplicacionRepository = aplicacionRepository;
        this.hiloDiscusionRepository = hiloDiscusionRepository;
        this.comentarioRepository = comentarioRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> obtenerStats() {
        AdminStatsDTO stats = new AdminStatsDTO(
                usuarioRepository.count(),
                aplicacionRepository.count(),
                hiloDiscusionRepository.count(),
                comentarioRepository.count()
        );

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<AdminUsuarioDTO>> listarUsuarios() {
        List<AdminUsuarioDTO> usuarios = usuarioRepository.findAll()
                .stream()
                .map(this::convertirUsuarioADTO)
                .toList();

        return ResponseEntity.ok(usuarios);
    }

    @PatchMapping("/usuarios/{id}/estado")
    public ResponseEntity<AdminUsuarioDTO> alternarEstadoUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Boolean activoActual = usuario.getActivo();
        usuario.setActivo(activoActual == null || !activoActual);

        Usuario guardado = usuarioRepository.save(usuario);

        return ResponseEntity.ok(convertirUsuarioADTO(guardado));
    }

    @PatchMapping("/usuarios/{id}/rol")
    public ResponseEntity<AdminUsuarioDTO> cambiarRolUsuario(
            @PathVariable Long id,
            @RequestParam String rol
    ) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setRol(rol);

        Usuario guardado = usuarioRepository.save(usuario);

        return ResponseEntity.ok(convertirUsuarioADTO(guardado));
    }

    @GetMapping("/hilos")
    public ResponseEntity<List<AdminHiloDTO>> listarHilos() {
        List<AdminHiloDTO> hilos = hiloDiscusionRepository.findAll()
                .stream()
                .map(this::convertirHiloADTO)
                .toList();

        return ResponseEntity.ok(hilos);
    }

    @PatchMapping("/hilos/{id}/estado")
    public ResponseEntity<AdminHiloDTO> cambiarEstadoHilo(
            @PathVariable Integer id,
            @RequestParam String estado
    ) {
        HiloDiscusion hilo = hiloDiscusionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hilo no encontrado"));

        hilo.setEstado(estado);

        HiloDiscusion guardado = hiloDiscusionRepository.save(hilo);

        return ResponseEntity.ok(convertirHiloADTO(guardado));
    }

    private AdminUsuarioDTO convertirUsuarioADTO(Usuario usuario) {
        return new AdminUsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getActivo()
        );
    }

    private AdminHiloDTO convertirHiloADTO(HiloDiscusion hilo) {
        return new AdminHiloDTO(
                hilo.getIdHilo(),
                hilo.getTitulo(),
                hilo.getContenido(),
                hilo.getIdUsuario(),
                hilo.getFechaCreacion(),
                hilo.getEstado()
        );
    }
}