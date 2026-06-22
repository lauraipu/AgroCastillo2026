package com.agrocastillo.backend.service;

import com.agrocastillo.backend.dto.ComentarioHiloDTO;
import com.agrocastillo.backend.dto.HiloDiscusionDTO;
import com.agrocastillo.backend.entity.Comentario;
import com.agrocastillo.backend.entity.HiloDiscusion;
import com.agrocastillo.backend.repository.ComentarioRepository;
import com.agrocastillo.backend.repository.HiloDiscusionRepository;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComunidadService {

    private final HiloDiscusionRepository hiloDiscusionRepository;
    private final ComentarioRepository comentarioRepository;

    public ComunidadService(HiloDiscusionRepository hiloDiscusionRepository,
                            ComentarioRepository comentarioRepository) {
        this.hiloDiscusionRepository = hiloDiscusionRepository;
        this.comentarioRepository = comentarioRepository;
    }

    public List<HiloDiscusionDTO> listarHilos() {
        return hiloDiscusionRepository.findAllByOrderByFechaCreacionDesc()
                .stream()
                .map(this::convertirHiloADTO)
                .collect(Collectors.toList());
    }

    public HiloDiscusionDTO obtenerHiloPorId(@NonNull Integer idHilo) {
        HiloDiscusion hilo = hiloDiscusionRepository.findById(idHilo)
                .orElseThrow(() -> new RuntimeException("No se encontró el hilo de discusión"));

        return convertirHiloADTO(hilo);
    }

    public HiloDiscusionDTO crearHilo(HiloDiscusionDTO dto) {
        if (dto.getTitulo() == null || dto.getTitulo().trim().isEmpty()) {
            throw new RuntimeException("El título del hilo es obligatorio");
        }

        if (dto.getContenido() == null || dto.getContenido().trim().isEmpty()) {
            throw new RuntimeException("El contenido del hilo es obligatorio");
        }

        if (dto.getIdUsuario() == null) {
            throw new RuntimeException("El usuario es obligatorio");
        }

        HiloDiscusion hilo = new HiloDiscusion();
        hilo.setTitulo(dto.getTitulo().trim());
        hilo.setContenido(dto.getContenido().trim());
        hilo.setIdUsuario(dto.getIdUsuario());

        HiloDiscusion guardado = hiloDiscusionRepository.save(hilo);

        return convertirHiloADTO(guardado);
    }

    public List<ComentarioHiloDTO> listarComentariosPorHilo(@NonNull Integer idHilo) {
        if (!hiloDiscusionRepository.existsById(idHilo)) {
            throw new RuntimeException("No se encontró el hilo de discusión");
        }

        return comentarioRepository.findByIdHiloOrderByFechaComentarioAsc(idHilo)
                .stream()
                .map(this::convertirComentarioADTO)
                .collect(Collectors.toList());
    }

    public ComentarioHiloDTO crearComentarioEnHilo(@NonNull Integer idHilo, ComentarioHiloDTO dto) {
        if (!hiloDiscusionRepository.existsById(idHilo)) {
            throw new RuntimeException("No se encontró el hilo de discusión");
        }

        if (dto.getContenido() == null || dto.getContenido().trim().isEmpty()) {
            throw new RuntimeException("El comentario no puede estar vacío");
        }

        if (dto.getIdUsuario() == null) {
            throw new RuntimeException("El usuario es obligatorio");
        }

        Comentario comentario = new Comentario();
        comentario.setContenido(dto.getContenido().trim());
        comentario.setIdUsuario(dto.getIdUsuario());
        comentario.setIdHilo(idHilo);
        comentario.setIdApp(null);

        Comentario guardado = comentarioRepository.save(comentario);

        return convertirComentarioADTO(guardado);
    }

    private HiloDiscusionDTO convertirHiloADTO(HiloDiscusion hilo) {
        return new HiloDiscusionDTO(
                hilo.getIdHilo(),
                hilo.getTitulo(),
                hilo.getContenido(),
                hilo.getIdUsuario(),
                hilo.getFechaCreacion()
        );
    }

    private ComentarioHiloDTO convertirComentarioADTO(Comentario comentario) {
        return new ComentarioHiloDTO(
                comentario.getIdComentario(),
                comentario.getContenido(),
                comentario.getIdUsuario(),
                comentario.getIdHilo(),
                comentario.getFechaComentario()
        );
    }
}