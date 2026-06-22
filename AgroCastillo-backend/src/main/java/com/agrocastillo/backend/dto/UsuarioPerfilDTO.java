package com.agrocastillo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UsuarioPerfilDTO {

    private Long id;
    private String nombre;
    private String email;
    private String rol;
    private String orcid;
    private String provider;
}