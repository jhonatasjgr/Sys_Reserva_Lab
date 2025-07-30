import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservaModel } from '../../model_enum/models';
import { ReservaService } from '../../services/reserva-service';
import { Router } from '@angular/router';
import { Auth } from '../../auth/services/auth';

@Component({
  selector: 'app-minhas-reservas-historico',
  imports: [CommonModule, DatePipe, RouterModule, FormsModule],
  templateUrl: './minhas-reservas-historico.html',
  styleUrl: './minhas-reservas-historico.scss'
})
export class MinhasReservasHistorico implements OnInit {
  minhasReservasPassadas: ReservaModel[] = [];
  minhasReservasPassadasFiltrado: ReservaModel[] = [];
  userId!: any 

  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalItens: number = 0;
  totalPaginas: number = 0;

  filtros = {
    nomeSala: '',
    status: '',
    dataInicio: '',
    dataFim: ''
  };

  statusDisponiveis: string[] = ['CONCLUIDA', 'CANCELADA', 'EM_ATRASO']; // mudar para pegar do banco de dados

  constructor(
    private reservasService: ReservaService,
    private router: Router,
    private authService: Auth 
  ) {}

  ngOnInit(): void {
    this.minhasReservasPassadas = [];
    this.minhasReservasPassadasFiltrado = [];
    this.paginaAtual = 1;
    
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

    this.reservasService.getMinhasReservasPassadas(this.userId, 1, 1000).subscribe({
      next: (response: any) => { 
        if (Array.isArray(response.data)) {
          this.minhasReservasPassadas = response.data.map((reserva:any) => ({
            ...reserva,
            dataInicio: new Date(reserva.dataInicio),
            dataFim: new Date(reserva.dataFim)
          }));
          
          this.minhasReservasPassadasFiltrado = [...this.minhasReservasPassadas];
          
          this.aplicarFiltros();
        } else {
          console.error('Erro: response.data não é um array como esperado. Conteúdo:', response.data);
          this.minhasReservasPassadas = [];
          this.minhasReservasPassadasFiltrado = [];
          this.atualizarPaginacao();
          return;
        }

        console.log('Minhas Reservas Passadas Carregadas (após mapeamento):', this.minhasReservasPassadas);
      },
      error: (err) => {
        console.error('Erro ao carregar minhas reservas passadas:', err);
        this.minhasReservasPassadas = [];
        this.minhasReservasPassadasFiltrado = [];
        this.atualizarPaginacao();
        alert('Erro ao carregar suas reservas passadas.');
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
    console.log('Dados originais:', this.minhasReservasPassadas.length);
    
    if (!this.minhasReservasPassadas || this.minhasReservasPassadas.length === 0) {
      console.log('Nenhum dado original para filtrar');
      this.minhasReservasPassadasFiltrado = [];
      this.atualizarPaginacao();
      return;
    }
    
    let reservasFiltradas = [...this.minhasReservasPassadas];
    console.log('Cópia inicial criada:', reservasFiltradas.length);

    if (this.filtros.nomeSala && this.filtros.nomeSala.trim()) {
      const nomeSalaNormalizado = this.filtros.nomeSala.toLowerCase().trim();
      console.log('Aplicando filtro nome sala:', nomeSalaNormalizado);
      reservasFiltradas = reservasFiltradas.filter(reserva => {
        const nomeSala = reserva.sala?.nome?.toLowerCase() || '';
        const match = nomeSala.includes(nomeSalaNormalizado);
        return match;
      });
      console.log('Após filtro nome sala:', reservasFiltradas.length);
    }

    if (this.filtros.status && this.filtros.status.trim()) {
      console.log('Aplicando filtro status:', this.filtros.status);
      reservasFiltradas = reservasFiltradas.filter(reserva => {
        const statusReserva = reserva.status_reserva?.nome_status;
        const match = statusReserva === this.filtros.status;
        return match;
      });
      console.log('Após filtro status:', reservasFiltradas.length);
    }

    if (this.filtros.dataInicio) {
      const dataInicioFiltro = new Date(this.filtros.dataInicio);
      console.log('Aplicando filtro data início:', dataInicioFiltro);
      reservasFiltradas = reservasFiltradas.filter(reserva => {
        const dataReserva = new Date(reserva.dataInicio);
        const match = dataReserva >= dataInicioFiltro;
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
        return match;
      });
      console.log('Após filtro data fim:', reservasFiltradas.length);
    }

    this.minhasReservasPassadasFiltrado = reservasFiltradas;
    
    this.atualizarPaginacao();
  }

  atualizarPaginacao() {
    this.totalItens = this.minhasReservasPassadasFiltrado.length;
    this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);
    if (this.paginaAtual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaAtual = 1; 
    } else if (this.totalPaginas === 0) {
      this.paginaAtual = 1;
    }
    
    console.log('Paginação atualizada (minhas reservas):', {
      totalItens: this.totalItens,
      totalPaginas: this.totalPaginas,
      paginaAtual: this.paginaAtual,
      itensPorPagina: this.itensPorPagina
    });
  }

  get itensPaginaAtual(): ReservaModel[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    const itens = this.minhasReservasPassadasFiltrado.slice(inicio, fim);
    
    console.log('Itens da página atual (minhas reservas):', {
      paginaAtual: this.paginaAtual,
      inicio,
      fim,
      totalFiltrados: this.minhasReservasPassadasFiltrado.length,
      itensPagina: itens.length
    });
    
    return itens;
  }

  limparFiltros() {
    this.filtros = {
      nomeSala: '',
      status: '',
      dataInicio: '',
      dataFim: ''
    };
    this.aplicarFiltros();
  }
}
