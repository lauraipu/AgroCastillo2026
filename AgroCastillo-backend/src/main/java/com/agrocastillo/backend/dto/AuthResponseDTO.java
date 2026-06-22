package com.agrocastillo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor // 👈 Genera automáticamente el constructor de 5 parámetros String
public class AuthResponseDTO {
    private String token;
    private String rol;     // Recibirá: "USUARIO", "INVESTIGADOR" o "ADMIN"
    private String nombre;
    private String email;
    private String orcid;
}