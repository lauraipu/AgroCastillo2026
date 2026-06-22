package com.agrocastillo.backend.dto;

public class UserResponseDTO {

    private Long id;
    private String nombre;
    private String email;
    private String rol;
    private String orcid;

    // Constructor vacío (Obligatorio para serialización de frameworks)
    public UserResponseDTO() {
    }

    // Constructor completo actualizado con ORCID
    public UserResponseDTO(Long id, String nombre, String email, String rol, String orcid) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.orcid = orcid;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getOrcid() {
        return orcid;
    }

    public void setOrcid(String orcid) {
        this.orcid = orcid;
    }
}