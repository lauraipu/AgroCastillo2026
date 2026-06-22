import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InicioService } from '../../services/inicio.service';

interface MetricaInicio {
  valor: string;
  etiqueta: string;
}

interface LineaInvestigacion {
  titulo: string;
  descripcion: string;
  enfoques: string[];
}

interface HerramientaDestacada {
  id: string;
  nombre: string;
  sector: 'CAFÉ' | 'CACAO';
  subarea: string;
  version: string;
  trl: string;
  descripcion: string;
  investigador: string;
}

interface FlujoTecnologico {
  paso: string;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent implements OnInit {

  metricas: MetricaInicio[] = [
    { valor: '0', etiqueta: 'Investigadores activos' },
    { valor: '0', etiqueta: 'Herramientas indexadas' },
    { valor: '0', etiqueta: 'Hilos de discusión' },
    { valor: '0', etiqueta: 'Líneas prioritarias' }
  ];

  constructor(private inicioService: InicioService) {}

  ngOnInit(): void {
    this.cargarMetricasReales();
  }

  cargarMetricasReales(): void {
    this.inicioService.obtenerEstadisticas().subscribe({
      next: (stats) => {
        this.metricas = [
          { valor: String(stats.investigadores), etiqueta: 'Investigadores activos' },
          { valor: String(stats.aplicaciones), etiqueta: 'Herramientas indexadas' },
          { valor: String(stats.hilos), etiqueta: 'Hilos de discusión' },
          { valor: String(stats.lineas), etiqueta: 'Líneas prioritarias' }
        ];
      },
      error: () => {
        this.metricas = [
          { valor: '—', etiqueta: 'Investigadores activos' },
          { valor: '—', etiqueta: 'Herramientas indexadas' },
          { valor: '—', etiqueta: 'Hilos de discusión' },
          { valor: '—', etiqueta: 'Líneas prioritarias' }
        ];
      }
    });
  }

  lineasInvestigacion: LineaInvestigacion[] = [
    {
      titulo: 'Caficultura de Precisión',
      descripcion:
        'Aplicación de sensores, visión artificial y modelos de análisis para optimizar procesos productivos del café.',
      enfoques: ['Clasificación de grano', 'Secado térmico', 'Monitoreo de variables']
    },
    {
      titulo: 'Cacao de Fino Aroma',
      descripcion:
        'Herramientas orientadas al análisis de calidad, nutrición mineral, trazabilidad y productividad del cacao regional.',
      enfoques: ['CCN-51', 'Análisis de suelos', 'Nutrición vegetal']
    },
    {
      titulo: 'Modelado Predictivo e Inteligencia Artificial',
      descripcion:
        'Desarrollo de modelos computacionales para apoyar decisiones técnicas en sistemas agroindustriales.',
      enfoques: ['Machine Learning', 'Redes convolucionales', 'Predicción productiva']
    }
  ];

  herramientasDestacadas: HerramientaDestacada[] = [
    {
      id: 'AC-01',
      nombre: 'CafiScan AI',
      sector: 'CAFÉ',
      subarea: 'Machine Learning',
      version: 'v2.1.0',
      trl: 'TRL 7',
      investigador: 'Carlos Mendoza',
      descripcion:
        'Clasificación visual de granos de café mediante redes neuronales convolucionales y procesamiento de imágenes.'
    },
    {
      id: 'AC-04',
      nombre: 'CacaoNutri Pro',
      sector: 'CACAO',
      subarea: 'Suelos y Nutrición',
      version: 'v2.0.0',
      trl: 'TRL 8',
      investigador: 'Albeiro Restrepo',
      descripcion:
        'Sistema de interpretación de análisis de suelos y recomendaciones técnicas para cultivos de cacao.'
    },
    {
      id: 'AC-06',
      nombre: 'DryingTemp Monitor',
      sector: 'CAFÉ',
      subarea: 'Post-cosecha',
      version: 'v1.8.0',
      trl: 'TRL 6',
      investigador: 'Mariana Torres',
      descripcion:
        'Monitoreo de curvas de secado térmico para apoyar operaciones post-cosecha en sistemas cafeteros.'
    }
  ];

  flujoTecnologico: FlujoTecnologico[] = [
    {
      paso: '01',
      titulo: 'Captura de datos',
      descripcion: 'Registro de variables agronómicas, productivas, ambientales y experimentales.'
    },
    {
      paso: '02',
      titulo: 'Procesamiento científico',
      descripcion: 'Análisis mediante modelos, algoritmos y validaciones técnicas.'
    },
    {
      paso: '03',
      titulo: 'Publicación de software',
      descripcion: 'Indexación de herramientas académicas con documentación y trazabilidad.'
    },
    {
      paso: '04',
      titulo: 'Transferencia tecnológica',
      descripcion: 'Uso de resultados por investigadores, estudiantes y actores del sector productivo.'
    }
  ];
}