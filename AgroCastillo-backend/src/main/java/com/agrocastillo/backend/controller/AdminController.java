package com.agrocastillo.backend.controller;

import com.agrocastillo.backend.dto.DashboardAdminDTO;
import com.agrocastillo.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UsuarioRepository usuarioRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardAdminDTO> obtenerDashboard() {
        long totalUsuarios = usuarioRepository.count();
        long totalInvestigadores = usuarioRepository.count();
        long totalAdministradores = usuarioRepository.count();

        return ResponseEntity.ok(
                new DashboardAdminDTO(
                        totalUsuarios,
                        totalInvestigadores,
                        totalAdministradores
                )
        );
    }
}