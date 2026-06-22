package com.agrocastillo.backend.dto;

import java.util.List;

public class AplicacionCatalogoDTO {

    private Long id;
    private String codigo;
    private String nombre;
    private String sector;
    private String subcategoria;
    private String descripcion;
    private String investigadorPrincipal;
    private String version;
    private Integer trl;
    private Integer consultas;
    private String urlAplicacion;
    private List<String> categorias;

    public AplicacionCatalogoDTO() {
    }

    public AplicacionCatalogoDTO(
            Long id,
            String codigo,
            String nombre,
            String sector,
            String subcategoria,
            String descripcion,
            String investigadorPrincipal,
            String version,
            Integer trl,
            Integer consultas,
            String urlAplicacion,
            List<String> categorias
    ) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.sector = sector;
        this.subcategoria = subcategoria;
        this.descripcion = descripcion;
        this.investigadorPrincipal = investigadorPrincipal;
        this.version = version;
        this.trl = trl;
        this.consultas = consultas;
        this.urlAplicacion = urlAplicacion;
        this.categorias = categorias;
    }

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public String getSector() {
        return sector;
    }

    public String getSubcategoria() {
        return subcategoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getInvestigadorPrincipal() {
        return investigadorPrincipal;
    }

    public String getVersion() {
        return version;
    }

    public Integer getTrl() {
        return trl;
    }

    public Integer getConsultas() {
        return consultas;
    }

    public String getUrlAplicacion() {
        return urlAplicacion;
    }

    public List<String> getCategorias() {
        return categorias;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public void setSubcategoria(String subcategoria) {
        this.subcategoria = subcategoria;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setInvestigadorPrincipal(String investigadorPrincipal) {
        this.investigadorPrincipal = investigadorPrincipal;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public void setTrl(Integer trl) {
        this.trl = trl;
    }

    public void setConsultas(Integer consultas) {
        this.consultas = consultas;
    }

    public void setUrlAplicacion(String urlAplicacion) {
        this.urlAplicacion = urlAplicacion;
    }

    public void setCategorias(List<String> categorias) {
        this.categorias = categorias;
    }
}