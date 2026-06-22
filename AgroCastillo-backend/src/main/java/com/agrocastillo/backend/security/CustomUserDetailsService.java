package com.agrocastillo.backend.security;

import com.agrocastillo.backend.entity.Usuario;
import com.agrocastillo.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado con email: " + email
                ));

        String authority = normalizarAuthority(usuario.getRol());
        boolean activo = usuario.getActivo() == null || usuario.getActivo();

        return new User(
                usuario.getEmail(),
                usuario.getPassword(),
                activo,
                true,
                true,
                true,
                List.of(new SimpleGrantedAuthority(authority))
        );
    }

    private String normalizarAuthority(String rol) {
        if (rol == null || rol.isBlank()) {
            return "ROLE_USUARIO";
        }

        String rolLimpio = rol.trim().toUpperCase();

        // Corregido aquí: quitadas las barras que rompían el String literal
        if (rolLimpio.startsWith("ROLE_")) {
            return rolLimpio;
        }

        return "ROLE_" + rolLimpio;
    }
}