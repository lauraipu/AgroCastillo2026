package com.agrocastillo.backend.dto;

public class AdminStatsDTO {

    private long totalUsuarios;
    private long totalAplicaciones;
    private long totalHilos;
    private long totalComentarios;

    public AdminStatsDTO() {
    }

    public AdminStatsDTO(long totalUsuarios, long totalAplicaciones, long totalHilos, long totalComentarios) {
        this.totalUsuarios = totalUsuarios;
        this.totalAplicaciones = totalAplicaciones;
        this.totalHilos = totalHilos;
        this.totalComentarios = totalComentarios;
    }

    public long getTotalUsuarios() {
        return totalUsuarios;
    }

    public void setTotalUsuarios(long totalUsuarios) {
        this.totalUsuarios = totalUsuarios;
    }

    public long getTotalAplicaciones() {
        return totalAplicaciones;
    }

    public void setTotalAplicaciones(long totalAplicaciones) {
        this.totalAplicaciones = totalAplicaciones;
    }

    public long getTotalHilos() {
        return totalHilos;
    }

    public void setTotalHilos(long totalHilos) {
        this.totalHilos = totalHilos;
    }

    public long getTotalComentarios() {
        return totalComentarios;
    }

    public void setTotalComentarios(long totalComentarios) {
        this.totalComentarios = totalComentarios;
    }
}