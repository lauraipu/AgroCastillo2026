package com.agrocastillo.backend.controller;

import com.agrocastillo.backend.dto.AuthResponseDTO;
import com.agrocastillo.backend.dto.LoginRequestDTO;
import com.agrocastillo.backend.dto.RegisterRequestDTO;
import com.agrocastillo.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        // Pasa directo al servicio, limpio y sin intermediarios
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequestDTO dto) {
        // Permite el registro fluido mapeado en tu lógica de negocio
        return ResponseEntity.ok(authService.register(dto));
    }

    @GetMapping("/oauth2/success")
    public ResponseEntity<AuthResponseDTO> oauth2Success(
            @RequestParam String email,
            @RequestParam String nombre
    ) {
        String emailDecodificado = URLDecoder.decode(email, StandardCharsets.UTF_8);
        String nombreDecodificado = URLDecoder.decode(nombre, StandardCharsets.UTF_8);

        return ResponseEntity.ok(authService.loginOAuth2(emailDecodificado, nombreDecodificado));
    }
}