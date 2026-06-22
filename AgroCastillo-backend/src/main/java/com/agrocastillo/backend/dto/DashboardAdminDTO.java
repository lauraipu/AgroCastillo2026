package com.agrocastillo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardAdminDTO {

    private long totalUsuarios;
    private long totalInvestigadores;
    private long totalAdministradores;
}
