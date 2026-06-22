package com.agrocastillo.backend.controller;

import com.agrocastillo.backend.dto.ActualizarUsuarioPerfilDTO;
import com.agrocastillo.backend.dto.UsuarioPerfilDTO;
import com.agrocastillo.backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioPerfilDTO> obtenerPerfil(
            Authentication authentication
    ) {
        String email = obtenerEmailAutenticado(authentication);

        return ResponseEntity.ok(
                usuarioService.obtenerPerfil(email)
        );
    }

    @PutMapping("/perfil/{id}")
    public ResponseEntity<UsuarioPerfilDTO> actualizarPerfil(
            @PathVariable @NonNull Long id,
            @RequestBody ActualizarUsuarioPerfilDTO dto,
            Authentication authentication
    ) {
        String email = obtenerEmailAutenticado(authentication);

        return ResponseEntity.ok(
                usuarioService.actualizarPerfil(
                        id,
                        email,
                        dto
                )
        );
    }

    private String obtenerEmailAutenticado(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof OidcUser oidcUser) {
            return oidcUser.getEmail();
        }

        if (principal instanceof OAuth2User oauth2User) {
            return oauth2User.getAttribute("email");
        }

        return authentication.getName();
    }
}