import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientesService, Ingrediente } from '../../services/ingredientes.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-ingredientes',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  // =================== TEMPLATE (HTML) ACTUALIZADO ===================
  template: `
    <div class="container">
      <h1>Ingredientes</h1>
      
      <form class="ingrediente-form" [formGroup]="form" (ngSubmit)="guardar()">
        <input type="text" placeholder="Nombre" formControlName="nombre" />
        <input type="number" placeholder="Precio" formControlName="precio" />
        <input type="text" placeholder="Unidad" formControlName="unidad" />
        <button type="submit" class="primary">{{ idEditando ? 'Actualizar' : 'Agregar' }}</button>
        <button type="button" *ngIf="idEditando" (click)="cancelarEdicion()">Cancelar</button>
      </form>
      
      <table class="ingredientes-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Unidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let ing of ingredientes">
            <td>{{ ing.nombre }}</td>
            <td>{{ ing.precio }}</td>
            <td>{{ ing.unidad }}</td>
            <td>
              <button (click)="editar(ing)">Editar</button>
              <button (click)="eliminar(ing.id!)" class="danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  // =================== ESTILOS (CSS) AÑADIDOS ===================
  styles: [`
    :host {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
    .container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      margin-bottom: 1.5rem;
    }
    .ingrediente-form {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 2rem;
    }
    .ingrediente-form input {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .ingrediente-form input[type="number"] {
      width: 80px; /* Ancho más pequeño para el precio */
    }
    button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #f0f0f0;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #e0e0e0;
    }
    button.primary {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
    }
    button.primary:hover {
      background-color: #0056b3;
    }
    button.danger {
      background-color: #dc3545;
      color: white;
      border-color: #dc3545;
    }
    button.danger:hover {
      background-color: #c82333;
    }
    .ingredientes-table {
      width: 100%;
      border-collapse: collapse;
    }
    .ingredientes-table th, .ingredientes-table td {
      border: 1px solid #ddd;
      padding: 0.75rem;
      text-align: left;
    }
    .ingredientes-table th {
      background-color: #f8f9fa;
      font-weight: bold;
    }
    .ingredientes-table td:last-child {
      display: flex;
      gap: 0.5rem;
    }
  `]
})
export class IngredientesComponent implements OnInit {
  // --- TODA TU LÓGICA DE TYPESCRIPT PERMANECE IGUAL ---
  // (El resto de tu archivo no cambia)
  ingredientes: Ingrediente[] = [];
  form: FormGroup;
  idEditando: number | null = null;

  constructor(
    private ingredientesService: IngredientesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      unidad: ['']
    });
  }

  ngOnInit(): void {
    this.cargarIngredientes();
  }

  cargarIngredientes() {
    this.ingredientesService.getIngredientes().subscribe((data: Ingrediente[]) => {
      this.ingredientes = data;
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const ingrediente: Ingrediente = {
      id: this.idEditando ?? undefined,
      ...this.form.value
    };

    const request$ = this.idEditando
      ? this.ingredientesService.updateIngrediente(ingrediente)
      : this.ingredientesService.addIngrediente(ingrediente);

    request$.subscribe(() => {
      this.cancelarEdicion();
      this.cargarIngredientes();
    });
  }

  editar(ingrediente: Ingrediente) {
    this.idEditando = ingrediente.id!;
    this.form.setValue({
      nombre: ingrediente.nombre,
      precio: ingrediente.precio,
      unidad: ingrediente.unidad
    });
  }

  cancelarEdicion() {
    this.idEditando = null;
    this.form.reset({ nombre: '', precio: 0, unidad: '' });
  }

  eliminar(id: number) {
    this.ingredientesService.deleteIngrediente(id).subscribe(() => {
      this.ingredientes = this.ingredientes.filter(i => i.id !== id);
    });
  }
}