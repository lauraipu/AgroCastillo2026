package com.agrocastillo.backend.service;

import com.agrocastillo.backend.dto.InvestigadorPublicoDTO;
import com.agrocastillo.backend.dto.InvestigadorPublicoProjection;
import com.agrocastillo.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class InvestigadorPublicoService {

    private final UsuarioRepository usuarioRepository;

    public InvestigadorPublicoService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<InvestigadorPublicoDTO> listarInvestigadores() {
        return usuarioRepository
                .listarInvestigadoresPublicos()
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    private InvestigadorPublicoDTO convertirADTO(InvestigadorPublicoProjection usuario) {
        String cvlac = usuario.getCvlacUrl();

        if (cvlac == null || cvlac.isBlank()) {
            cvlac = "#";
        }

        String orcid = usuario.getOrcid();

        if (orcid == null) {
            orcid = "";
        }

        String rolVisible = normalizarRol(usuario.getRol());

        return new InvestigadorPublicoDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                rolVisible,
                "Universidad Surcolombiana",
                "Investigación agroindustrial",
                cvlac,
                orcid,
                List.of(
                        "Software académico",
                        "Agroindustria",
                        "Investigación aplicada"
                )
        );
    }

    private String normalizarRol(String rol) {
        if (rol == null || rol.isBlank()) {
            return "Investigador";
        }

        String rolLimpio = rol
                .replace("ROLE_", "")
                .replace("_", " ")
                .toLowerCase();

        return Character.toUpperCase(rolLimpio.charAt(0)) + rolLimpio.substring(1);
    }
}