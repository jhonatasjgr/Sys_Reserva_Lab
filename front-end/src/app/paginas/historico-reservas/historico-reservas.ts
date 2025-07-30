import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservaModel } from '../../model_enum/models';
import { ReservaService } from '../../services/reserva-service';

@Component({
  selector: 'app-historico-reservas',
  imports: [CommonModule,
    RouterModule, 
    DatePipe,
    FormsModule
  ],
  templateUrl: './historico-reservas.html',
  styleUrl: './historico-reservas.scss'
})
export class HistoricoReservas implements OnInit {

  historicoReservas: ReservaModel[] = [];
  historicoReservasFiltrado: ReservaModel[] = [];

  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalItens: number = 0;
  totalPaginas: number = 0;

  filtros = {
    nomeSala: '',
    status: '',
    solicitante: '',
    dataInicio: '',
    dataFim: ''
  };

  statusDisponiveis: string[] = ['CONCLUIDA', 'CANCELADA', 'EM_ATRASO']; // mudar para pegar do banco de dados

  constructor(
    private reservasService: ReservaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.historicoReservas = [];
    this.historicoReservasFiltrado = [];
    this.paginaAtual = 1;
    
    this.carregarHistoricoReservas();
  }

  carregarHistoricoReservas() {
    this.reservasService.getAll(1, 1000).subscribe({
      next: (response: any) => {

        if (Array.isArray(response.data)) {
          this.historicoReservas = response.data.map((reserva:any) => ({
            ...reserva,
            dataInicio: new Date(reserva.dataInicio),
            dataFim: new Date(reserva.dataFim)
          }));
          
          this.historicoReservasFiltrado = [...this.historicoReservas];
          
          this.aplicarFiltros();
        } else {
          this.historicoReservas = [];
          this.historicoReservasFiltrado = [];
          this.atualizarPaginacao();
          return;
        }

      },
      error: (err) => {
        this.historicoReservas = [];
        this.historicoReservasFiltrado = [];
        this.atualizarPaginacao();
      }
    });
  }

  irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  paginaAnterior() {
    this.irParaPagina(this.paginaAtual - 1);
  }

  proximaPagina() {
    this.irParaPagina(this.paginaAtual + 1);
  }

  aplicarFiltros() {
    console.log('Filtros aplicados:', this.filtros);
    console.log('Dados originais:', this.historicoReservas.length);
    
    if (!this.historicoReservas || this.historicoReservas.length === 0) {
      this.historicoReservasFiltrado = [];
      this.atualizarPaginacao();
      return;
    }
    
    let reservasFiltradas = [...this.historicoReservas];
    console.log('Cópia inicial criada:', reservasFiltradas.length);

    if (this.filtros.nomeSala && this.filtros.nomeSala.trim()) {
      const nomeSalaNormalizado = this.filtros.nomeSala.toLowerCase().trim();
      console.log('Aplicando filtro nome sala:', nomeSalaNormalizado);
      reservasFiltradas = reservasFiltradas.filter(reserva => {
        const nomeSala = reserva.sala?.nome?.toLowerCase() || '';
        const match = nomeSala.includes(nomeSalaNormalizado);
        if (!match) {
          console.log(`Sala "${reserva.sala?.nome}" não passou no filtro`);
        }
        return match;
      });
      console.log('Após filtro nome sala:', reservasFiltradas.length);
    }

    if (this.filtros.status && this.filtros.status.trim()) {
      console.log('Aplicando filtro status:', this.filtros.status);
      reservasFiltradas = reservasFiltradas.filter(reserva => {
        const statusReserva = reserva.status_reserva?.nome_status;
        const match = statusReserva === this.filtros.status;
        if (!match) {
          console.log(`Status "${statusReserva}" não passou no filtro`);
        }
        return match;
      });
      console.log('Após filtro status:', reservasFiltradas.length);
    }

    if (this.filtros.solicitante && this.filtros.solicitante.trim()) {
      const solicitanteNormalizado = this.filtros.solicitante.toLowerCase().trim();
      console.log('Aplicando filtro solicitante:', solicitanteNormalizado);
      reservasFiltradas = reservasFiltradas.filter(reserva => {
        const nomeUsuario = reserva.usuario?.nome?.toLowerCase() || '';
        const match = nomeUsuario.includes(solicitanteNormalizado);
        if (!match) {
          console.log(`Usuário "${reserva.usuario?.nome}" não passou no filtro`);
        }
        return match;
      });
      console.log('Após filtro solicitante:', reservasFiltradas.length);
    }

    if (this.filtros.dataInicio) {
      const dataInicioFiltro = new Date(this.filtros.dataInicio);
      console.log('Aplicando filtro data início:', dataInicioFiltro);
      reservasFiltradas = reservasFiltradas.filter(reserva => {
        const dataReserva = new Date(reserva.dataInicio);
        const match = dataReserva >= dataInicioFiltro;
        if (!match) {
          console.log(`Data ${dataReserva} não passou no filtro (antes de ${dataInicioFiltro})`);
        }
        return match;
      });
      console.log('Após filtro data início:', reservasFiltradas.length);
    }

    if (this.filtros.dataFim) {
      const dataFimFiltro = new Date(this.filtros.dataFim);
      dataFimFiltro.setHours(23, 59, 59, 999);
      console.log('Aplicando filtro data fim:', dataFimFiltro);
      reservasFiltradas = reservasFiltradas.filter(reserva => {
        const dataReserva = new Date(reserva.dataFim);
        const match = dataReserva <= dataFimFiltro;
        if (!match) {
          console.log(`Data ${dataReserva} não passou no filtro (depois de ${dataFimFiltro})`);
        }
        return match;
      });
      console.log('Após filtro data fim:', reservasFiltradas.length);
    }

    this.historicoReservasFiltrado = reservasFiltradas;
    
    this.atualizarPaginacao();
  }

  atualizarPaginacao() {
    this.totalItens = this.historicoReservasFiltrado.length;
    this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);
    if (this.paginaAtual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaAtual = 1; 
    } else if (this.totalPaginas === 0) {
      this.paginaAtual = 1;
    }
    
    console.log('Paginação atualizada:', {
      totalItens: this.totalItens,
      totalPaginas: this.totalPaginas,
      paginaAtual: this.paginaAtual,
      itensPorPagina: this.itensPorPagina
    });
  }

  get itensPaginaAtual(): ReservaModel[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    const itens = this.historicoReservasFiltrado.slice(inicio, fim);
    
    console.log('Itens da página atual:', {
      paginaAtual: this.paginaAtual,
      inicio,
      fim,
      totalFiltrados: this.historicoReservasFiltrado.length,
      itensPagina: itens.length
    });
    
    return itens;
  }

  limparFiltros() {
    this.filtros = {
      nomeSala: '',
      status: '',
      solicitante: '',
      dataInicio: '',
      dataFim: ''
    };
    this.aplicarFiltros();
  }
}
