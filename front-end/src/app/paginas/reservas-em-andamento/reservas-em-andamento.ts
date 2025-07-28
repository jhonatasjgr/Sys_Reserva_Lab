import { Component } from '@angular/core';
import { ReservaModel } from '../../model_enum/models';
import { ReservaService } from '../../services/reserva-service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservas-em-andamento',
  imports: [
    CommonModule,
    RouterModule,
    DatePipe
  ],
  templateUrl: './reservas-em-andamento.html',
  styleUrl: './reservas-em-andamento.scss'
})
export class ReservasEmAndamento {
 reservasAtivas: ReservaModel[] = [];

 private STATUS_CONCLUIDA: number = 3; 
  constructor(
    private reservasService: ReservaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarMinhasReservasAtivas();
    this.reservasService.getStatusReserva().subscribe(
      status => {
        this.STATUS_CONCLUIDA = status.find((s: any) => s.nome_status === 'CONCLUIDA').id;
      }
    );
  }

  carregarMinhasReservasAtivas() {
    this.reservasService.getReservasEMAndamento().subscribe(data =>
      {
       this.reservasAtivas = data
      }
    );
  }

  concluirReserva(reservaId: number) {
    this.reservasService.update(reservaId, { statusReservaId: this.STATUS_CONCLUIDA}).subscribe({
      next: () => {
        Swal.fire({
          title: 'Reserva Concluída!',
          text: 'A reserva foi concluída com sucesso.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.carregarMinhasReservasAtivas();
      },
      error: (err) => {
        Swal.fire({
          title: 'Erro ao Concluir Reserva',
          text: 'Ocorreu um erro ao concluir a reserva.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  cancelarReserva(reservaId: number) {
    this.reservasService.update(reservaId, { statusReservaId: 2 }).subscribe({
      next: () => {
        this.carregarMinhasReservasAtivas(); 
      },
      error: (err) => {
        console.error('Erro ao cancelar reserva:', err);
      }
    });
  }
}
