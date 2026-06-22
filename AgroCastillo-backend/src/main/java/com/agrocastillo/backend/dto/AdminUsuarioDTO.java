package com.agrocastillo.backend.dto;

public class AdminUsuarioDTO {

    private Long id;
    private String nombre;
    private String correo;
    private String rol;
    private Boolean activo;

    public AdminUsuarioDTO() {
    }

    public AdminUsuarioDTO(Long id, String nombre, String correo, String rol, Boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.rol = rol;
        this.activo = activo;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public String getRol() {
        return rol;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}