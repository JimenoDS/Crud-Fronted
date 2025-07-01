import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// La interfaz está bien definida.
export interface Ingrediente {
  id?: number;
  nombre: string;
  precio: number;
  unidad?: string;
}

@Injectable({providedIn: 'root'})
export class IngredientesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/ingredientes';

  getIngredientes(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(this.apiUrl);
  }

  addIngrediente(data: Ingrediente){
    return this.http.post(this.apiUrl, data);
  }

  deleteIngrediente(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ========= ESTA ES LA FUNCIÓN CORREGIDA =============
  updateIngrediente(ingrediente: Ingrediente): Observable<Ingrediente> {
    // Es una buena práctica asegurarse de que el ingrediente tenga un ID.
    if (!ingrediente.id) {
      throw new Error('El ingrediente debe tener un ID para ser actualizado.');
    }
    
    // 1. Usamos el ID del ingrediente para construir la URL.
    // 2. Pasamos el objeto 'ingrediente' completo como el cuerpo de la petición PUT.
    return this.http.put<Ingrediente>(`${this.apiUrl}/${ingrediente.id}`, ingrediente);
  }
}
