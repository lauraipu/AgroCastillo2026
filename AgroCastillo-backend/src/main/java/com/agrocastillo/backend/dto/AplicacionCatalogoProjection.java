package com.agrocastillo.backend.dto;

public interface AplicacionCatalogoProjection {

    Long getId();

    String getNombre();

    String getDescripcion();

    String getUrlAplicacion();

    String getEstado();

    String getInvestigadorPrincipal();

    String getCategorias();
}