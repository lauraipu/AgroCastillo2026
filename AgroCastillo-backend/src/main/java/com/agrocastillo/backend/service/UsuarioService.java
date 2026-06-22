package com.agrocastillo.backend.service;

import com.agrocastillo.backend.dto.ActualizarUsuarioPerfilDTO;
import com.agrocastillo.backend.dto.UsuarioPerfilDTO;
import com.agrocastillo.backend.entity.Usuario;
import com.agrocastillo.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioPerfilDTO obtenerPerfil(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return mapearPerfil(usuario);
    }

    public UsuarioPerfilDTO actualizarPerfil(
            @NonNull Long id,
            String emailAutenticado,
            ActualizarUsuarioPerfilDTO dto
    ) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getEmail().equals(emailAutenticado)) {
            throw new RuntimeException("No puedes modificar el perfil de otro usuario");
        }

        usuario.setNombre(dto.getNombre());
        usuario.setOrcid(dto.getOrcid());

        Usuario actualizado = usuarioRepository.save(usuario);

        return mapearPerfil(actualizado);
    }

    private UsuarioPerfilDTO mapearPerfil(Usuario usuario) {
        return new UsuarioPerfilDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getOrcid(),
                usuario.getProvider()
        );
    }
}