package com.agrocastillo.backend.dto;

import java.time.LocalDateTime;

public class AplicacionInvestigadorDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private String urlAplicacion;
    private Long idAutor;
    private String estado;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    public AplicacionInvestigadorDTO() {
    }

    public AplicacionInvestigadorDTO(
            Long id,
            String nombre,
            String descripcion,
            String urlAplicacion,
            Long idAutor,
            String estado,
            LocalDateTime fechaCreacion,
            LocalDateTime fechaActualizacion
    ) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.urlAplicacion = urlAplicacion;
        this.idAutor = idAutor;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
        this.fechaActualizacion = fechaActualizacion;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getUrlAplicacion() {
        return urlAplicacion;
    }

    public Long getIdAutor() {
        return idAutor;
    }

    public String getEstado() {
        return estado;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setUrlAplicacion(String urlAplicacion) {
        this.urlAplicacion = urlAplicacion;
    }

    public void setIdAutor(Long idAutor) {
        this.idAutor = idAutor;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
}