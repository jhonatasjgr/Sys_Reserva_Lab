import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReservaModel, StatusReservaModel } from '../../model_enum/models';
import { ReservaService } from '../../services/reserva-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gerenciar-reservas',
  imports: [CommonModule, RouterModule],
  templateUrl: './gerenciar-reservas.html',
  styleUrl: './gerenciar-reservas.scss'
})
export class GerenciarReservas {
  reservasPendentes: ReservaModel[] = [];

  private STATUS_CANCELADA: number = 4;
  private STATUS_EM_ANDAMENTO: number = 2;
  constructor(
    private reservasService: ReservaService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
   this.carregarReservasPendentesHoje();
   this.reservasService.getStatusReserva().subscribe(
      status => {
        this.STATUS_CANCELADA = status.find((s: StatusReservaModel) => s.nome_status === 'CANCELADA')?.id || 4;
        this.STATUS_EM_ANDAMENTO = status.find((s: StatusReservaModel) => s.nome_status === 'EM_ANDAMENTO')?.id || 2;
      })
  }

  carregarReservasPendentesHoje() {
    this.reservasService.getReservasPendentes().subscribe({
      next: (data: ReservaModel[]) => {
        console.log('Dados recebidos:', data); 
        this.reservasPendentes = data.map(reserva => ({
          ...reserva,
          dataInicio: new Date(reserva.dataInicio),
          dataFim: new Date(reserva.dataFim)
        }));
        console.log('Reservas Pendentes Carregadas:', this.reservasPendentes);
      },
      error: (err) => {
        Swal.fire({
          title: 'Erro ao Carregar Reservas Pendentes',
          text: 'Ocorreu um erro ao carregar as reservas pendentes.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  aprovarReserva(reservaId: number) {
    this.reservasService.update(reservaId, { statusReservaId: this.STATUS_EM_ANDAMENTO}).subscribe({ // Ou APROVADA
      next: () => {
        Swal.fire({
          title: 'Reserva Aprovada!',
          text: 'A reserva foi aprovada com sucesso.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.carregarReservasPendentesHoje();
      },
      error: (err) => {
        Swal.fire({
          title: 'Erro ao Aprovar Reserva',
          text: 'Ocorreu um erro ao aprovar a reserva.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  cancelarReserva(reservaId: number) {
    Swal.fire({
      title: "Deseja Cancelar essa Reserva?",
      text: "Não será possível reverter essa ação.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, cancelar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservasService.update(reservaId, { statusReservaId: this.STATUS_CANCELADA }).subscribe({
      next: () => {
        this.carregarReservasPendentesHoje();
      },
      error: (err) => {
        Swal.fire({
          title: 'Erro ao Cancelar Reserva',
          text: 'Ocorreu um erro ao cancelar a reserva. ' + (err.error?.message || 'Erro desconhecido.'),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
      }
    });
  }
}
