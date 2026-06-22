package com.agrocastillo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder // 👈 Agrega esto para mapear por nombre de campo y no por posición
@NoArgsConstructor
@AllArgsConstructor
public class InvestigadorPerfilDTO {
    private Long id;
    private String nombre;
    private String email;
    private String rol;
    private String orcid;
    private String provider;
}