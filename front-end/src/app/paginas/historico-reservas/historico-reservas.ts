import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReservaModel } from '../../model_enum/models';
import { ReservaService } from '../../services/reserva-service';

@Component({
  selector: 'app-historico-reservas',
  imports: [CommonModule,
    RouterModule, 
    DatePipe
  ],
  templateUrl: './historico-reservas.html',
  styleUrl: './historico-reservas.scss'
})
export class HistoricoReservas {
  historicoReservas: ReservaModel[] = [];

    paginaAtual: number = 1;
  itensPorPagina: number = 10; // Padrão
  totalItens: number = 0;
  totalPaginas: number = 0;

  constructor(
    private reservasService: ReservaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarHistoricoReservas();
  }

  carregarHistoricoReservas() {
    // Passa os parâmetros de paginação para o serviço
    this.reservasService.getAll(this.paginaAtual, this.itensPorPagina).subscribe({
      next: (response: any) => { // Espera o tipo PaginatedReservas
        console.log('Dados recebidos (objeto response completo):', response);
        console.log('Tipo de response.data:', typeof response.data, 'É array?', Array.isArray(response.data));

        if (Array.isArray(response.data)) {
          this.historicoReservas = response.data.map((reserva:any) => ({
            ...reserva,
            dataInicio: new Date(reserva.dataInicio),
            dataFim: new Date(reserva.dataFim)
          }));
        } else {
          console.error('Erro: response.data não é um array como esperado. Conteúdo:', response.data);
          this.historicoReservas = [];
          return;
        }

        this.totalItens = response.total;
        this.totalPaginas = response.totalPaginas;
        this.paginaAtual = response.paginaAtual;
        this.itensPorPagina = response.itensPorPagina;

        console.log('Histórico de Reservas Carregado (após mapeamento):', this.historicoReservas);
      },
      error: (err) => {
        console.error('Erro ao carregar histórico de reservas:', err);
      }
    });
  }

  // Métodos de paginação
  irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
      this.carregarHistoricoReservas();
    }
  }

  paginaAnterior() {
    this.irParaPagina(this.paginaAtual - 1);
  }

  proximaPagina() {
    this.irParaPagina(this.paginaAtual + 1);
  }
}
