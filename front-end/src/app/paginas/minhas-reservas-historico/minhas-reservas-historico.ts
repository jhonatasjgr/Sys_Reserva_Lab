import { Component } from '@angular/core';
import { ReservaModel } from '../../model_enum/models';
import { ReservaService } from '../../services/reserva-service';
import { Router } from '@angular/router';
import { Auth } from '../../auth/services/auth';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-minhas-reservas-historico',
  imports: [DatePipe],
  // templateUrl: './minhas-reservas-historico.html',
  templateUrl: './minhas-reservas-historico.html',
  styleUrl: './minhas-reservas-historico.scss'
})
export class MinhasReservasHistorico {
  minhasReservasPassadas: ReservaModel[] = [];
  userId!: any 

  paginaAtual: number = 1;
  itensPorPagina: number = 10; // Padrão
  totalItens: number = 0;
  totalPaginas: number = 0;

  constructor(
    private reservasService: ReservaService,
    private router: Router,
    private authService: Auth 
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId === null) {
      this.router.navigate(['/login']);
      return;
    } 
    this.carregarMinhasReservasPassadas();
  }

  carregarMinhasReservasPassadas() {
    if(!this.userId) {
      console.error('Usuário não autenticado. Redirecionando para login.');
      this.router.navigate(['/login']);
      return;
    }

    this.reservasService.getMinhasReservasPassadas(this.userId, this.paginaAtual, this.itensPorPagina).subscribe({
      next: (response: any) => { 
        if (Array.isArray(response.data)) {
          this.minhasReservasPassadas = response.data.map((reserva:any) => ({
            ...reserva,
            dataInicio: new Date(reserva.dataInicio),
            dataFim: new Date(reserva.dataFim)
          }));
        } else {
          console.error('Erro: response.data não é um array como esperado. Conteúdo:', response.data);
          this.minhasReservasPassadas = [];
          return;
        }

        this.totalItens = response.total;
        this.totalPaginas = response.totalPaginas;
        this.paginaAtual = response.paginaAtual;
        this.itensPorPagina = response.itensPorPagina;

        console.log('Minhas Reservas Passadas Carregadas (após mapeamento):', this.minhasReservasPassadas);
      },
      error: (err) => {
        console.error('Erro ao carregar minhas reservas passadas:', err);
        alert('Erro ao carregar suas reservas passadas.');
      }
    });
  }
   irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
      this.carregarMinhasReservasPassadas();
    }
  }

  paginaAnterior() {
    this.irParaPagina(this.paginaAtual - 1);
  }

  proximaPagina() {
    this.irParaPagina(this.paginaAtual + 1);
  }
}
