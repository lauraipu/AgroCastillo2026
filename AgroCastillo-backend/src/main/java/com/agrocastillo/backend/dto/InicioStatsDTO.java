package com.agrocastillo.backend.dto;

public class InicioStatsDTO {

    private long investigadores;
    private long aplicaciones;
    private long hilos;
    private long lineas;

    public InicioStatsDTO() {
    }

    public InicioStatsDTO(long investigadores, long aplicaciones, long hilos, long lineas) {
        this.investigadores = investigadores;
        this.aplicaciones = aplicaciones;
        this.hilos = hilos;
        this.lineas = lineas;
    }

    public long getInvestigadores() {
        return investigadores;
    }

    public void setInvestigadores(long investigadores) {
        this.investigadores = investigadores;
    }

    public long getAplicaciones() {
        return aplicaciones;
    }

    public void setAplicaciones(long aplicaciones) {
        this.aplicaciones = aplicaciones;
    }

    public long getHilos() {
        return hilos;
    }

    public void setHilos(long hilos) {
        this.hilos = hilos;
    }

    public long getLineas() {
        return lineas;
    }

    public void setLineas(long lineas) {
        this.lineas = lineas;
    }
}