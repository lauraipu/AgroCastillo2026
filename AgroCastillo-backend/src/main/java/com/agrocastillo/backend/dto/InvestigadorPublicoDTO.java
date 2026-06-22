package com.agrocastillo.backend.dto;

import java.util.List;

public class InvestigadorPublicoDTO {

    private Long id;
    private String nombre;
    private String correo;
    private String rol;
    private String institucion;
    private String lineaEnfoque;
    private String cvlacUrl;
    private String orcid;
    private List<String> palabrasClave;

    public InvestigadorPublicoDTO() {
    }

    public InvestigadorPublicoDTO(
            Long id,
            String nombre,
            String correo,
            String rol,
            String institucion,
            String lineaEnfoque,
            String cvlacUrl,
            String orcid,
            List<String> palabrasClave
    ) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.rol = rol;
        this.institucion = institucion;
        this.lineaEnfoque = lineaEnfoque;
        this.cvlacUrl = cvlacUrl;
        this.orcid = orcid;
        this.palabrasClave = palabrasClave;
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

    public String getInstitucion() {
        return institucion;
    }

    public String getLineaEnfoque() {
        return lineaEnfoque;
    }

    public String getCvlacUrl() {
        return cvlacUrl;
    }

    public String getOrcid() {
        return orcid;
    }

    public List<String> getPalabrasClave() {
        return palabrasClave;
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

    public void setInstitucion(String institucion) {
        this.institucion = institucion;
    }

    public void setLineaEnfoque(String lineaEnfoque) {
        this.lineaEnfoque = lineaEnfoque;
    }

    public void setCvlacUrl(String cvlacUrl) {
        this.cvlacUrl = cvlacUrl;
    }

    public void setOrcid(String orcid) {
        this.orcid = orcid;
    }

    public void setPalabrasClave(List<String> palabrasClave) {
        this.palabrasClave = palabrasClave;
    }
}