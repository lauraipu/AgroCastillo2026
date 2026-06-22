package com.agrocastillo.backend.service;

import com.agrocastillo.backend.dto.ActualizarInvestigadorPerfilDTO;
import com.agrocastillo.backend.dto.InvestigadorPerfilDTO;
import com.agrocastillo.backend.entity.Usuario;
import com.agrocastillo.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class InvestigadorService {

    private final UsuarioRepository usuarioRepository;

    public InvestigadorPerfilDTO obtenerPerfil(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Investigador no encontrado"));

        return mapearPerfil(usuario);
    }

    public InvestigadorPerfilDTO actualizarPerfil(
            @NonNull Long id,
            String emailAutenticado,
            ActualizarInvestigadorPerfilDTO dto
    ) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Investigador no encontrado"));

        if (!usuario.getEmail().equals(emailAutenticado)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes modificar el perfil de otro usuario");
        }

        usuario.setNombre(dto.getNombre());
        usuario.setOrcid(dto.getOrcid());

        Usuario actualizado = usuarioRepository.save(usuario);

        return mapearPerfil(actualizado);
    }

    private InvestigadorPerfilDTO mapearPerfil(Usuario usuario) {
        return InvestigadorPerfilDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol() != null ? usuario.getRol() : "INVESTIGADOR") // Asigna el rol real
                .orcid(usuario.getOrcid() != null ? usuario.getOrcid() : "")
                .provider(usuario.getProvider() != null ? usuario.getProvider() : "LOCAL") // Evita nulos en provider
                .build();
    }
}