import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AdminDashboardService,
  AdminHilo,
  AdminUsuario
} from '../../services/admin-dashboard.service';

interface Kpi {
  titulo: string;
  valor: string;
  descripcion: string;
}

interface AdminAplicacion {
  id: number;
  codigo: string;
  nombre: string;
  investigador: string;
  sector: string;
  documentacion: 'Completa' | 'En Revisión' | 'Pendiente';
  cumpleEstandares: boolean;
}

interface ReporteModeracion {
  id: number;
  hilo: string;
  motivo: string;
  autor: string;
  fecha: string;
  estado: 'Pendiente' | 'Revisado';
}

type FiltroReporte = 'Pendiente' | 'Revisado' | 'Todos';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {

  cargando = signal(true);

  kpis = signal<Kpi[]>([]);
  usuarios = signal<AdminUsuario[]>([]);
  aplicacionesPendientes = signal<AdminAplicacion[]>([]);
  reportes = signal<ReporteModeracion[]>([]);

  filtroReportes = signal<FiltroReporte>('Pendiente');

  reportesFiltrados = computed(() => {
    const actual = this.filtroReportes();
    if (actual === 'Todos') return this.reportes();
    return this.reportes().filter(r => r.estado === actual);
  });

  constructor(private adminDashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard(): void {
    this.cargando.set(true);
    
    this.adminDashboardService.obtenerStats().subscribe({
      next: (stats) => {
        this.kpis.set([
          { titulo: 'Total Usuarios', valor: stats.totalUsuarios.toString(), descripcion: 'Usuarios registrados en el sistema' },
          { titulo: 'Aplicaciones', valor: stats.totalAplicaciones.toString(), descripcion: 'Herramientas en catálogo' },
          { titulo: 'Hilos en Foro', valor: stats.totalHilos.toString(), descripcion: 'Discusiones de la comunidad' },
          { titulo: 'Comentarios', valor: stats.totalComentarios.toString(), descripcion: 'Aportes en foros' }
        ]);
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error cargando métricas:', err);
        this.cargando.set(false);
      }
    });
  }

  cargarUsuarios(): void {
    this.adminDashboardService.listarUsuarios().subscribe({
      next: (res) => {
        this.usuarios.set(res);
        this.cargarHilosModeracion();
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.cargando.set(false);
      }
    });
  }

  cargarHilosModeracion(): void {
    this.adminDashboardService.listarHilos().subscribe({
      next: (res: AdminHilo[]) => {
        const mapeados: ReporteModeracion[] = res.map(h => ({
          id: h.id,
          hilo: h.titulo,
          motivo: h.contenido.substring(0, 40) + '...',
          autor: `Usuario ID: ${h.idUsuario}`,
          fecha: h.fechaCreacion,
          estado: h.estado === 'REVISADO' ? 'Revisado' : 'Pendiente'
        }));
        this.reportes.set(mapeados);
        this.generarMockAplicaciones();
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando hilos de moderación:', err);
        this.cargando.set(false);
      }
    });
  }

  generarMockAplicaciones(): void {
    this.aplicacionesPendientes.set([
      { id: 101, codigo: 'APP-AGRO-01', nombre: 'BioSimulador de Suelos', investigador: 'Dr. Carlos Mendoza', sector: 'Agrícola', documentacion: 'Completa', cumpleEstandares: true },
      { id: 102, codigo: 'APP-AGRO-02', nombre: 'RiegoOptimizador v2', investigador: 'Dra. Elena Rostova', sector: 'Ingeniería', documentacion: 'En Revisión', cumpleEstandares: false }
    ]);
  }

  aprobarAplicacion(id: number): void {
    alert(`Aplicación ${id} marcada como aprobada visualmente.`);
  }

  rechazarAplicacion(id: number): void {
    alert(`Aplicación ${id} marcada para corrección visualmente.`);
  }

  promoverUsuario(id: number): void {
    this.adminDashboardService.cambiarRolUsuario(id, 'INVESTIGADOR').subscribe({
      next: () => this.cargarUsuarios(),
      error: () => alert('No se pudo promover el usuario.')
    });
  }

  degradarUsuario(id: number): void {
    this.adminDashboardService.cambiarRolUsuario(id, 'USUARIO').subscribe({
      next: () => this.cargarUsuarios(),
      error: () => alert('No se pudo degradar el usuario.')
    });
  }

  alternarEstadoUsuario(id: number): void {
    this.adminDashboardService.alternarEstadoUsuario(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => alert('No se pudo cambiar el estado del usuario.')
    });
  }

  cambiarFiltroReportes(filtro: FiltroReporte): void {
    this.filtroReportes.set(filtro);
  }

  marcarReporteRevisado(id: number): void {
    this.adminDashboardService.cambiarEstadoHilo(id, 'REVISADO').subscribe({
      next: () => this.cargarHilosModeracion(),
      error: () => alert('No se pudo marcar el hilo como revisado.')
    });
  }
}