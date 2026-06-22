package com.agrocastillo.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActualizarInvestigadorPerfilDTO {

    private String nombre;

    private String lineaEnfoque;

    private String orcid;

    private String cvlac;
}