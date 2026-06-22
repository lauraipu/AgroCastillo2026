package com.agrocastillo.backend.dto;

import java.time.LocalDateTime;

public class ComentarioHiloDTO {

    private Integer idComentario;
    private String contenido;
    private Integer idUsuario;
    private Integer idHilo;
    private LocalDateTime fechaComentario;

    public ComentarioHiloDTO() {
    }

    public ComentarioHiloDTO(Integer idComentario, String contenido, Integer idUsuario, Integer idHilo, LocalDateTime fechaComentario) {
        this.idComentario = idComentario;
        this.contenido = contenido;
        this.idUsuario = idUsuario;
        this.idHilo = idHilo;
        this.fechaComentario = fechaComentario;
    }

    public Integer getIdComentario() {
        return idComentario;
    }

    public void setIdComentario(Integer idComentario) {
        this.idComentario = idComentario;
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

    public Integer getIdHilo() {
        return idHilo;
    }

    public void setIdHilo(Integer idHilo) {
        this.idHilo = idHilo;
    }

    public LocalDateTime getFechaComentario() {
        return fechaComentario;
    }

    public void setFechaComentario(LocalDateTime fechaComentario) {
        this.fechaComentario = fechaComentario;
    }
}