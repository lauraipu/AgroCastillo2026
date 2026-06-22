package com.agrocastillo.backend.dto;

import java.time.LocalDateTime;

public class AdminHiloDTO {

    private Integer id;
    private String titulo;
    private String contenido;
    private Integer idUsuario;
    private LocalDateTime fechaCreacion;
    private String estado;

    public AdminHiloDTO() {
    }

    public AdminHiloDTO(Integer id, String titulo, String contenido, Integer idUsuario, LocalDateTime fechaCreacion, String estado) {
        this.id = id;
        this.titulo = titulo;
        this.contenido = contenido;
        this.idUsuario = idUsuario;
        this.fechaCreacion = fechaCreacion;
        this.estado = estado;
    }

    public Integer getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getContenido() {
        return contenido;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}