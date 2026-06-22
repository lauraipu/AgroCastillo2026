package com.agrocastillo.backend.service;

import com.agrocastillo.backend.dto.AplicacionCatalogoDTO;
import com.agrocastillo.backend.dto.AplicacionCatalogoProjection;
import com.agrocastillo.backend.repository.AplicacionRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class AplicacionCatalogoService {

    private final AplicacionRepository aplicacionRepository;

    public AplicacionCatalogoService(AplicacionRepository aplicacionRepository) {
        this.aplicacionRepository = aplicacionRepository;
    }

    public List<AplicacionCatalogoDTO> listarAplicacionesActivas() {
        return aplicacionRepository
                .listarCatalogoAplicacionesActivas()
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    private AplicacionCatalogoDTO convertirADTO(AplicacionCatalogoProjection app) {
        List<String> categorias = convertirCategorias(app.getCategorias());

        String primeraCategoria = categorias.isEmpty()
                ? "Sin categoría"
                : categorias.get(0);

        return new AplicacionCatalogoDTO(
                app.getId(),
                "APP-" + app.getId(),
                app.getNombre(),
                "General",
                primeraCategoria,
                app.getDescripcion(),
                app.getInvestigadorPrincipal(),
                "v1.0",
                1,
                0,
                app.getUrlAplicacion(),
                categorias
        );
    }

    private List<String> convertirCategorias(String categoriasTexto) {
        if (categoriasTexto == null || categoriasTexto.isBlank()) {
            return List.of("Sin categoría");
        }

        return Arrays.stream(categoriasTexto.split(","))
                .map(String::trim)
                .filter(categoria -> !categoria.isBlank())
                .toList();
    }
}
