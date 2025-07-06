import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-conversor',
  templateUrl: './conversor.component.html',
  styleUrls: ['./conversor.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ConversorComponent {
  form: FormGroup;
  resultadoKg: number | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      valor: [null, [Validators.required, Validators.min(0.001)]],
      unidad: ['g', Validators.required]
    });
  }

  convertir() {
    const valor = this.form.value.valor;
    const unidad = this.form.value.unidad;

    let kg = 0;
    switch (unidad) {
      case 'g': kg = valor / 1000; break;
      case 'mg': kg = valor / 1000000; break;
      case 'lb': kg = valor * 0.453592; break;
      case 'oz': kg = valor * 0.0283495; break;
    }

    this.resultadoKg = kg;
  }

  limpiar() {
    this.form.reset({ unidad: 'g' });
    this.resultadoKg = null;
  }
}