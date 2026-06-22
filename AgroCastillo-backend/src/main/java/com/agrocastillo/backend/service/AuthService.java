package com.agrocastillo.backend.service;

import com.agrocastillo.backend.dto.AuthResponseDTO;
import com.agrocastillo.backend.dto.LoginRequestDTO;
import com.agrocastillo.backend.dto.RegisterRequestDTO;
import com.agrocastillo.backend.entity.Usuario;
import com.agrocastillo.backend.repository.UsuarioRepository;
import com.agrocastillo.backend.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );

        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado en el sistema"));

        String token = jwtService.generarToken(usuario);

        // CORRECCIÓN: usuario.getRol() ya devuelve un String. Evitamos usar .name()
        String rolString = (usuario.getRol() != null && !usuario.getRol().isEmpty())
                ? usuario.getRol().toUpperCase()
                : "USUARIO";

        // Retorna exactamente los 5 parámetros String requeridos por el DTO
        return new AuthResponseDTO(
                token,
                rolString,
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getOrcid()
        );
    }

    public String register(RegisterRequestDTO dto) {
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("El correo electrónico ya se encuentra registrado");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(dto.getNombre());
        nuevoUsuario.setEmail(dto.getEmail());
        nuevoUsuario.setPassword(passwordEncoder.encode(dto.getPassword()));

        // CORRECCIÓN: Guardamos el rol directamente como String (en mayúsculas)
        if (dto.getRol() != null && !dto.getRol().isEmpty()) {
            nuevoUsuario.setRol(dto.getRol().toUpperCase());
        } else {
            nuevoUsuario.setRol("USUARIO");
        }

        nuevoUsuario.setActivo(true);
        usuarioRepository.save(nuevoUsuario);

        return "Usuario registrado exitosamente";
    }

    public AuthResponseDTO loginOAuth2(String email, String nombre) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseGet(() -> {
                    Usuario nuevo = new Usuario();
                    nuevo.setEmail(email);
                    nuevo.setNombre(nombre);
                    nuevo.setPassword("");
                    nuevo.setRol("USUARIO"); // Asignación directa como String plano
                    nuevo.setActivo(true);
                    return usuarioRepository.save(nuevo);
                });

        String token = jwtService.generarToken(usuario);
        String rolString = (usuario.getRol() != null && !usuario.getRol().isEmpty())
                ? usuario.getRol().toUpperCase()
                : "USUARIO";

        // CORRECCIÓN: Envía exactamente los mismos 5 argumentos String en orden
        return new AuthResponseDTO(
                token,
                rolString,
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getOrcid()
        );
    }
}