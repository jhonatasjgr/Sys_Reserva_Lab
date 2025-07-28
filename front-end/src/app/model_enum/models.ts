// export enum StatusReservaBackendValues { // Renomeado para evitar confusão com o modelo
//     PENDENTE = 1,
//     EM_ANDAMENTO = 2,
//     CONCLUIDA = 3,
//     CANCELADA = 4
// }

// export enum TipoUsuarioBackendValues { // Renomeado
//     ADMIN = 3,
//     PROFESSOR = 1,
//     VIGILANTE = 2,
// }

// export enum TipoSalaBackendValues {
//     SALA_AULA = 1,
//     LABORATORIO = 2,
//     AUDITORIO = 3,
//     MINI_AUDITORIO = 4,
// }
export interface StatusReservaModel {
  id: number;
  nome_status: string;
  // ... outros campos que sua tabela status_reserva possa ter
}
export interface TipoUsuarioModel {
    id: number;
    nome_tipo: string;
}

export interface TipoSalaModel {
    id: number;
    nome_tipo: string;
}

export interface StatusReservaModel {
    id: number;
    nome_status: string;
}


export interface UsuarioModel {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: TipoUsuarioModel; 
  createdAt: Date;
  updatedAt: Date;
  status: boolean; 
}

export interface Sala {
  id: number;
  nome: string;
  tipo_sala: TipoSalaModel; 
  tipo_salaId: number;
  capacidade: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReservaModel {
  id: number;
  usuarioId: number;
  salaId: number; 
  dataInicio: Date;
  dataFim: Date;
  observacao?: string;
  createdAt: Date;
  updatedAt: Date;

  status_reserva: StatusReservaModel; 
  statusReservaId: number; 
  usuario?: UsuarioModel; 
  sala?: Sala; 
}

export interface ReadAvailabilityDto {
    date: string;
    salaId: number | null; // Pode ser null se a consulta for para todas as salas
    occupiedSlots: {
        start: Date;
        end: Date;
        status_reserva: StatusReservaModel; // Corrigido para objeto aninhado
        observacao?: string; // Usando 'observacao' conforme seu esquema
        usuarioId?: number;
        salaId?: number;
        id?: number;
    }[];
}

export interface CreateReservaDto {
  usuarioId: number; // Agora é obrigatório enviar o ID do usuário
  salaId: number;    // Agora é obrigatório enviar o ID da sala
  dataInicio: string; // Formato ISO 8601 string
  dataFim: string;   // Formato ISO 8601 string
  observacao?: string;
  statusReservaId?: number; // ID do status inicial, por exemplo, PENDENTE (1)
}

export interface UpdateReservaDto {
  salaId?: number;
  dataInicio?: string;
  dataFim?: string;
  statusReservaId?: number; // Para aprovar/cancelar, enviar o ID do status
  observacao?: string;
  usuarioId?: number; // Adicionado, caso possa mudar o usuário da reserva
}

export interface TipoSalaModel { // Interface para a tabela tipos_sala
  id: number;
  nome_tipo: string; // Ex: 'LABORATORIO', 'SALA_AULA'
}

export interface Sala {
  id: number;
  nome: string;
  capacidade: number;
  createdAt: Date;
  updatedAt: Date;
  tipo_salaId: number; // Foreign key
  tipo_sala: TipoSalaModel; // A relação completa como objeto
}

export interface CreateSalaDto {
  nome: string;
  capacidade: number;
  tipoSalaId: number; // ID do tipo de sala (FK)
}

export interface UpdateSalaDto {
  nome?: string;
  capacidade?: number;
  tipoSalaId?: number;
}

export interface ReadSalaDto {
  id: number;
  nome: string;
  capacidade: number;
  createdAt: Date;
  updatedAt: Date;
  tipoSalaId: number;
  tipo_sala: TipoSalaModel;
}