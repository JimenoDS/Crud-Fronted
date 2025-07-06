import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientesService, Ingrediente } from '../../services/ingredientes.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ingredientes',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  templateUrl: './ingredientes.component.html',
  styleUrls: ['./ingredientes.component.scss']
})
export class IngredientesComponent implements OnInit {

  ingredientes: Ingrediente[] = [];
  form: FormGroup;
  idEditando: number | null = null;
  pesoKg: number | null = null; 

  constructor(
    private ingredientesService: IngredientesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      unidad: [''],
      peso: [null],
      unidadPeso: ['g']
    });
  }

  ngOnInit(): void {
    this.cargarIngredientes();
  }

  // ✅ MÉTODO ACTUALIZADO CON MANEJO DE ERRORES
  cargarIngredientes(): void {
    this.ingredientesService.getIngredientes().subscribe({
      next: (data: Ingrediente[]) => {
        this.ingredientes = data;
        console.log('Ingredientes cargados con éxito:', data);
      },
      error: (err) => {
        console.error('¡ERROR al cargar los ingredientes!:', err);
      }
    });
  }

  convertirAKg(peso: any, unidad: string | undefined): number {
    const numPeso = parseFloat(peso);
    if (isNaN(numPeso) || !unidad) {
      return 0;
    }
    switch (unidad) {
      case 'g': return numPeso / 1000;
      case 'mg': return numPeso / 1_000_000;
      case 'lb': return numPeso * 0.453592;
      case 'oz': return numPeso * 0.0283495;
      default: return 0;
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    const ingrediente: Ingrediente = {
      id: this.idEditando ?? undefined,
      ...this.form.value
    };

    const request$ = this.idEditando
      ? this.ingredientesService.updateIngrediente(ingrediente)
      : this.ingredientesService.addIngrediente(ingrediente);

    request$.subscribe({
      next: () => {
        this.cancelarEdicion();
        this.cargarIngredientes();
      },
      error: (err) => {
        console.error('¡ERROR al guardar el ingrediente!:', err);
      }
    });
  }

  editar(ingrediente: Ingrediente): void {
    this.idEditando = ingrediente.id!;
    this.form.patchValue(ingrediente);
  }

  cancelarEdicion(): void {
    this.idEditando = null;
    this.form.reset({
      nombre: '',
      precio: 0,
      unidad: '',
      peso: null,
      unidadPeso: 'g'
    });
  }

  eliminar(id: number): void {
    this.ingredientesService.deleteIngrediente(id).subscribe({
      next: () => {
        this.ingredientes = this.ingredientes.filter(i => i.id !== id);
      },
      error: (err) => {
        console.error('¡ERROR al eliminar el ingrediente!:', err);
      }
    });
  }
}