import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateSalaDto, TipoSalaModel } from '../../model_enum/models';
import { SalaService } from '../../services/sala-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criar-sala',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './criar-sala.html',
  styleUrl: './criar-sala.scss'
})
export class CriarSala {
criarSalaForm: FormGroup;
  tiposSala: TipoSalaModel[] = [];

  constructor(
    private fb: FormBuilder,
    private salaService: SalaService,
    private router: Router
  ) {
    this.criarSalaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      capacidade: ['', [Validators.required, Validators.min(1)]],
      tipoSalaId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarTiposSala();
  }

  carregarTiposSala() {
    this.salaService.getTiposSala().subscribe({
      next: (tipos: TipoSalaModel[]) => {
        this.tiposSala = tipos;
        console.log('Tipos de Sala carregados:', this.tiposSala);
      },
      error: (err) => {
        console.error('Erro ao carregar tipos de sala:', err);
      }
    });
  }

  async onSubmit() {
    if (this.criarSalaForm.valid) {
      const novaSala: CreateSalaDto = this.criarSalaForm.value;
      novaSala.capacidade = Number(novaSala.capacidade);
      novaSala.tipoSalaId = Number(novaSala.tipoSalaId);

      this.salaService.createSala(novaSala).subscribe({
        next: () => {
          this.criarSalaForm.reset();
          this.criarSalaForm.get('tipoSalaId')?.setValue('');
        },
        error: (err) => {
          console.error('Erro ao criar sala:', err);
        }
      });
    } else {
      this.criarSalaForm.markAllAsTouched();
      Swal.fire({
        title: 'Erro ao Criar Sala',
        text: 'Por favor, preencha todos os campos corretamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
}
