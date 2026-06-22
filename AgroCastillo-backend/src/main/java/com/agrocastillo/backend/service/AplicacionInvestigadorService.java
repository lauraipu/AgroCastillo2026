package com.agrocastillo.backend.service;

import com.agrocastillo.backend.dto.AplicacionInvestigadorDTO;
import com.agrocastillo.backend.entity.Aplicacion;
import com.agrocastillo.backend.repository.AplicacionRepository;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AplicacionInvestigadorService {

    private final AplicacionRepository aplicacionRepository;

    public AplicacionInvestigadorService(AplicacionRepository aplicacionRepository) {
        this.aplicacionRepository = aplicacionRepository;
    }

    public List<AplicacionInvestigadorDTO> listarPorInvestigador(Long idAutor) {
        return aplicacionRepository
                .findByIdAutorAndEstadoNotOrderByFechaActualizacionDesc(idAutor, "eliminado")
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    public AplicacionInvestigadorDTO crear(Long idAutor, AplicacionInvestigadorDTO dto) {
        Aplicacion aplicacion = new Aplicacion();

        aplicacion.setNombre(dto.getNombre());
        aplicacion.setDescripcion(dto.getDescripcion());
        aplicacion.setUrlAplicacion(dto.getUrlAplicacion());
        aplicacion.setIdAutor(idAutor);
        aplicacion.setEstado("activo");

        Aplicacion guardada = aplicacionRepository.save(aplicacion);

        return convertirADTO(guardada);
    }

    public AplicacionInvestigadorDTO actualizar(
            Long idAutor,
            @NonNull Long idAplicacion,
            AplicacionInvestigadorDTO dto
    ) {
        Aplicacion aplicacion = aplicacionRepository.findById(idAplicacion)
                .orElseThrow(() -> new RuntimeException("No existe la aplicación con ID: " + idAplicacion));

        if (!aplicacion.getIdAutor().equals(idAutor)) {
            throw new RuntimeException("No tienes permiso para editar esta aplicación.");
        }

        aplicacion.setNombre(dto.getNombre());
        aplicacion.setDescripcion(dto.getDescripcion());
        aplicacion.setUrlAplicacion(dto.getUrlAplicacion());
        aplicacion.setEstado("activo");

        Aplicacion actualizada = aplicacionRepository.save(aplicacion);

        return convertirADTO(actualizada);
    }

    public void eliminarLogico(Long idAutor, @NonNull Long idAplicacion) {
        Aplicacion aplicacion = aplicacionRepository.findById(idAplicacion)
                .orElseThrow(() -> new RuntimeException("No existe la aplicación con ID: " + idAplicacion));

        if (!aplicacion.getIdAutor().equals(idAutor)) {
            throw new RuntimeException("No tienes permiso para eliminar esta aplicación.");
        }

        aplicacion.setEstado("eliminado");
        aplicacionRepository.save(aplicacion);
    }

    private AplicacionInvestigadorDTO convertirADTO(Aplicacion app) {
        return new AplicacionInvestigadorDTO(
                app.getIdApp(),
                app.getNombre(),
                app.getDescripcion(),
                app.getUrlAplicacion(),
                app.getIdAutor(),
                app.getEstado(),
                app.getFechaCreacion(),
                app.getFechaActualizacion()
        );
    }
}