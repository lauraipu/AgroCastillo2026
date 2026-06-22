package com.agrocastillo.backend.dto;

import java.time.LocalDateTime;

public class HiloDiscusionDTO {

    private Integer idHilo;
    private String titulo;
    private String contenido;
    private Integer idUsuario;
    private LocalDateTime fechaCreacion;

    public HiloDiscusionDTO() {
    }

    public HiloDiscusionDTO(Integer idHilo, String titulo, String contenido, Integer idUsuario, LocalDateTime fechaCreacion) {
        this.idHilo = idHilo;
        this.titulo = titulo;
        this.contenido = contenido;
        this.idUsuario = idUsuario;
        this.fechaCreacion = fechaCreacion;
    }

    public Integer getIdHilo() {
        return idHilo;
    }

    public void setIdHilo(Integer idHilo) {
        this.idHilo = idHilo;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}