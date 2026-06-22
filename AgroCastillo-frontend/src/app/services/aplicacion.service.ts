import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AplicacionService {
	private http = inject(HttpClient);
	private readonly API_URL = 'https://localhost:8443/api/aplicaciones';

	obtenerAplicaciones(): Observable<any[]> {
		return this.http.get<any[]>(this.API_URL);
	}

	obtenerAplicacion(id: number): Observable<any> {
		return this.http.get<any>(`${this.API_URL}/${id}`);
	}
}
