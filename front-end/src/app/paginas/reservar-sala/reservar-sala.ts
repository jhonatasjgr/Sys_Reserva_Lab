import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateReservaDto, Sala } from '../../model_enum/models';
import { SalaService } from '../../services/sala-service';
import { ReservaService } from '../../services/reserva-service';
import { Auth } from '../../auth/services/auth';
import { Usuario } from '../../services/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservar-sala',
 imports: [ CommonModule,
    ReactiveFormsModule,
    RouterModule],
  templateUrl: './reservar-sala.html',
  styleUrl: './reservar-sala.scss'
})
export class ReservarSala implements OnInit {

  form: FormGroup;
  salas: Sala[] = [];
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

 
  private STATUS_PENDENTE_ID = 1;
  private USUARIO_LOGADO_ID!: any; 

  constructor(
    private fb: FormBuilder,
    private salasService: SalaService,
    private reservasService: ReservaService,
    // private router: Router,
    private AuthService: Auth, 
    // private UsuarioService: Usuario
  ) {
    this.form = this.fb.group({
      salaId: [null, Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      observacao: [''],
      statusReservaId: [this.STATUS_PENDENTE_ID, Validators.required]
    });
  }

  ngOnInit(): void {
    this.USUARIO_LOGADO_ID = this.AuthService.getUserId();

   this.reservasService.getStatusReserva().subscribe(
    status =>{
      status.find((s: any) => { s.nome_status === 'PENDENTE' ? this.STATUS_PENDENTE_ID = s.id : null; });
    }
   ); 
    this.carregarSalas();
  }

  carregarSalas(): void {
    this.salasService.getSalas().subscribe({
      next: (data) => {
        this.salas = data.sort((a, b) => a.nome.localeCompare(b.nome)); // ordenar em ordem alfabética
        
      },
      error: (err) => {
       Swal.fire({
          title: 'Erro ao Carregar Salas',
          text: 'Ocorreu um erro ao carregar a lista de salas.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  submit(): void {
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    this.form.markAllAsTouched(); 

    if (this.form.invalid) {
      this.mensagemErro = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      return;
    }

    // Validação adicional de datas
    const dataInicio = new Date(this.form.value.dataInicio);
    const dataFim = new Date(this.form.value.dataFim);

    if (dataInicio >= dataFim) {
      this.mensagemErro = 'A data e hora de início devem ser anteriores à data e hora de fim.';
      return;
    }
    
    const payload: CreateReservaDto = {
      usuarioId: this.USUARIO_LOGADO_ID, 
      salaId: this.form.value.salaId,
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString(),
      observacao: this.form.value.observacao,
      statusReservaId: this.STATUS_PENDENTE_ID || 1
    };
    this.reservasService.createReserva(payload).subscribe({
      next: (reservaCriada) => {
        this.mensagemSucesso = `Reserva para a sala ${reservaCriada.sala?.nome} criada com sucesso! Status: ${reservaCriada.status_reserva?.nome_status}.`;
       
        Swal.fire({
          title: 'Reserva Criada!',
          text: this.mensagemSucesso,
          icon: 'success',
        });

        this.form.reset();
      },
      error: (err) => {
        Swal.fire({
          title: 'Erro ao Criar Reserva',
          text: `Ocorreu um erro ao criar a reserva. ${err.error?.message || 'Erro desconhecido.'}`,
          icon: 'error',
        });
      }
    });
  }
}
