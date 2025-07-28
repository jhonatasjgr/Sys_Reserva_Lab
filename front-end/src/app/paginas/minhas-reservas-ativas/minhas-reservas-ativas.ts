import { Component, Pipe } from '@angular/core';
import { ReservaModel } from '../../model_enum/models';
import { ReservaService } from '../../services/reserva-service';
import { Router } from '@angular/router';
import { Auth } from '../../auth/services/auth';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-minhas-reservas-ativas',
  imports: [DatePipe],
  templateUrl: './minhas-reservas-ativas.html',
  styleUrl: './minhas-reservas-ativas.scss'
})
export class MinhasReservasAtivas {
  minhasReservas: ReservaModel[] = [];
  usuarioId!:any

  private STATUS_CANCELADA: number = 4; 

  constructor(
    private reservasService: ReservaService,
    private router: Router,
    private authService: Auth
  ) {
        this.carregarMinhasReservasAtivas();
  }

  ngOnInit(): void {
    this.usuarioId = this.authService.getUserId();
    this.reservasService.getStatusReserva().subscribe(
      status => {
        this.STATUS_CANCELADA = status.find((s: any) => s.nome_status === 'CANCELADA').id;
      });
  }

  carregarMinhasReservasAtivas() {
    this.reservasService.getMinhasReservasAtivas(this.usuarioId).subscribe(
      reserva => {
        this.minhasReservas = reserva.filter((reserva: ReservaModel) => {
          return reserva.status_reserva.nome_status === 'EM_ANDAMENTO' || reserva.status_reserva.nome_status === 'PENDENTE';
        });
      }
    );
    console.log('Minhas Reservas Ativas Carregadas:', this.minhasReservas);
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
          console.log('Reserva cancelada com sucesso');
          this.carregarMinhasReservasAtivas();
        },
        complete: () => {
          Swal.fire({
          title: "Cancelada!",
          text: "Sua reserva foi cancelada.",
          icon: "success"
        });
        },
       error: (err) => {
         Swal.fire({
           title: "Erro!",
           text: "Ocorreu um erro ao cancelar sua reserva.",
           icon: "error"
         });
       }
      });
        
      }
    });

    // if (confirm('Tem certeza que deseja cancelar esta reserva?')) { 
    //   this.reservasService.update(reservaId, { statusReservaId: this.STATUS_CANCELADA }).subscribe({
    //     next: () => {
    //       console.log('Reserva cancelada com sucesso');
    //       this.carregarMinhasReservasAtivas();
    //     },
    //     complete: () => {
    //       console.log('Requisição de cancelamento concluída');
    //     },
    //    error: (err) => {
    //       console.error('Erro ao cancelar reserva:', err)
    //     }
    //   });
    // }
  }

  alertaEmAndamento(reserva: ReservaModel) {
    Swal.fire({
      title: 'Reserva em Andamento',
      text: `Você não pode cancelar uma reserva que está em andamento.`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }
}
