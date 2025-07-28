import { ConflictException, NotFoundException, BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { SalasService } from 'src/salas/salas.service';
import { Prisma } from 'generated/prisma';

export interface PaginatedReservas {
  data: any[]; // O array de reservas para a página atual
  total: number;       // O número total de reservas (sem paginação)
  paginaAtual: number; // O número da página atual
  itensPorPagina: number; // O limite de itens por página
  totalPaginas: number;  // O número total de páginas
}
@Injectable()
export class ReservasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly servicoSalas: SalasService
  ) {}

   async create(createReservaDto: CreateReservaDto) {
    // Validação de datas (frontend e backend)
    console.log('Dados recebidos para criação de reserva:', createReservaDto);
    const dataInicio = new Date(createReservaDto.dataInicio);
    const dataFim = new Date(createReservaDto.dataFim);

    if (dataInicio >= dataFim) {
      throw new BadRequestException('A data de início deve ser anterior à data de fim.');
    }

    try {
     
      const { usuarioId, salaId, statusReservaId, ...outrosDadosReserva } = createReservaDto;




   
      const novaReserva = await this.prisma.reserva.create({
        data: {
          ...outrosDadosReserva, // Inclui observacao, dataInicio (string), dataFim (string)
          dataInicio: dataInicio, // Converte para objeto Date
          dataFim: dataFim,       // Converte para objeto Date
          usuario: {
            connect: { id: usuarioId },
          },
          sala: {
            connect: { id: salaId },
          },
          status_reserva: {
            connect: { id: statusReservaId}, // Conecta ao status PENDENTE (id 1)
          },
          observacao: createReservaDto.observacao || null, // Observação opcional
        },
        include: { // Inclui os dados relacionados na resposta
          usuario: { select: { id: true, nome: true, email: true, tipo_usuario: true } },
          sala: { include: { tipo_sala: true } },
          status_reserva: true,
        },
      });

      console.log(`Notificação: Nova reserva para sala ${novaReserva.sala.nome} de ${novaReserva.usuario.nome} está ${novaReserva.status_reserva.nome_status}.`);

      return novaReserva;
    } catch (error: any) {
      console.error('Erro detalhado ao criar reserva:', error); // Log para depuração

      // Tratamento de erros específicos do Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2003: Falha de Foreign Key (usuárioId, salaId, statusReservaId não existem)
        if (error.code === 'P2003') {
          throw new BadRequestException('Erro de relacionamento: um dos IDs fornecidos (usuário, sala, status da reserva) não existe.');
        }
        // P2002: Violação de Unique Constraint (se houver no schema ou trigger não pegar)
        if (error.code === 'P2002') {
          throw new ConflictException('Conflito de dados. Verifique a unicidade.');
        }
        // P2025: Registro necessário para conexão não encontrado (se o connect falhar por ID inexistente)
        if (error.code === 'P2025') {
            throw new NotFoundException(`Erro de relacionamento: ${error.meta?.cause || 'registro relacionado não encontrado'}.`);
        }
        // Erros genéricos do banco de dados não mapeados especificamente
        throw new BadRequestException(`Erro do banco de dados: ${error.message}`);
      }
      // Captura erros lançados pelo TRIGGER MySQL (PrismaClientUnknownRequestError)
      else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
         if (error.message.includes('Conflito de horário:')) {
            throw new ConflictException('Conflito de horário: A sala já está reservada para este período.');
        }
        // Outros erros de banco de dados desconhecidos
        throw new BadRequestException(`Erro no banco de dados: ${error.message}`);
      }
      // Re-lança exceções já tratadas (NotFound, BadRequest, Conflict)
      else if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      // Tratamento para erros gerais do JavaScript/TypeScript (ex: erro de lógica antes do DB)
      else if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      // fallback para qualquer outro tipo de erro não capturado
      throw new InternalServerErrorException('Erro interno do servidor ao criar reserva. Tente novamente mais tarde.');
    }
  }

  

  async getReservasPendentes() { // reservas pendentes do dia atual
    const dataHoje = new Date();
    const inicioDoDiaAtual = new Date(dataHoje);
    inicioDoDiaAtual.setHours(0, 0, 0, 0);

    const inicioDoProximoDia = new Date(dataHoje);
    inicioDoProximoDia.setDate(dataHoje.getDate() + 1);
    inicioDoProximoDia.setHours(0, 0, 0, 0);

    const reservasPendentes = await this.prisma.reserva.findMany({
      where: {
        status_reserva: { 
          nome_status: 'PENDENTE',
        },
        dataInicio: {
          gte: inicioDoDiaAtual,
          lt: inicioDoProximoDia,
        },
      },
      include: {
        usuario: {
          select: { nome: true, email: true, tipo_usuario: true }
        },
        sala: { include: { tipo_sala: true } },
        status_reserva: true,
      },
      orderBy: {
        dataInicio: 'asc',
      }
    });
    console.log(`Reservas pendentes encontradas: ${reservasPendentes.length}`);
    return reservasPendentes;
  }

  async getReservasEmAndamento() { // reservas em andamento do dia atual
                                    // considera reservas que começaram hoje e ainda não terminaram
    const dataHoje = new Date();
    const inicioDoDiaAtual = new Date(dataHoje);
    inicioDoDiaAtual.setHours(0, 0, 0, 0);

    const inicioDoProximoDia = new Date(dataHoje);
    inicioDoProximoDia.setDate(dataHoje.getDate() + 1);
    inicioDoProximoDia.setHours(0, 0, 0, 0);

    const reservasEmAndamento = await this.prisma.reserva.findMany({
      where: {
        status_reserva: { 
          nome_status: 'EM_ANDAMENTO',
        },
        dataInicio: {
          gte: inicioDoDiaAtual,
          lt: inicioDoProximoDia,
        },
      },
      include: {
        usuario: {
          select: { nome: true, email: true, tipo_usuario: true }
        },
        sala: { include: { tipo_sala: true } },
        status_reserva: true,
      },
      orderBy: {
        dataInicio: 'asc',
      }
    });
    console.log(`Reservas em andamento encontradas: ${reservasEmAndamento.length}`);
    return reservasEmAndamento;
  }
  
 async getReservasPassadasEmAndamento() { // reservas pendentes e em andamento do dia atual
    const dataHoje = new Date();
    const inicioDoDiaAtual = new Date(dataHoje);
    inicioDoDiaAtual.setHours(0, 0, 0, 0);

    const reservasEmAndamento = await this.prisma.reserva.findMany({
      where: {
        status_reserva: { 
          nome_status: {
            in: ['EM_ANDAMENTO']
          }
        },
        dataFim: {
          lt: inicioDoDiaAtual,
        },
      },
      include: {
        usuario: { select: { id: true, nome: true, email: true, tipo_usuario: true } },
        sala: { include: { tipo_sala: true } },
        status_reserva: true,
      },
      orderBy: {
        dataInicio: 'asc',
      }
    });
    console.log(`Reservas passadas em andamento encontradas: ${reservasEmAndamento.length}`);
    return reservasEmAndamento;
  }

  

  async getReservasAtivas(usuarioId: number) { // reservas de datas passadas ou da data atua que já foram concluídas ou canceladas
      const dataAtual = new Date();
      dataAtual.setHours(0, 0, 0, 0);

      const reservasAtivas = await this.prisma.reserva.findMany({
        where: {
          usuarioId: usuarioId,
          AND: [
            {
              OR: [
                {
                  dataInicio: {
                    gte: dataAtual,
                  },
                  status_reserva: { 
                    id: {
                      in: [1, 2] 
                    }
                  }
                },
                {
                  dataFim: {
                    lt: dataAtual,
                  }
                }
              ]
            }
          ]
        },
        include: {
          usuario: { select: { id: true, nome: true, email: true, tipo_usuario: true } },
          sala: { include: { tipo_sala: true } },
          status_reserva: true,
        },
        orderBy: {
          dataInicio: 'desc',
        }
      });
      return reservasAtivas;
    }

   async getMinhasReservas(usuarioId: number, pagina: number = 1, limite: number = 10): Promise<PaginatedReservas> {
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    const agora = new Date(); // Hora e minuto atuais para comparar com o fim do dia

    const pularRegistros = (pagina - 1) * limite; // Calcula quantos registros pular

    const condicoesFiltro: Prisma.ReservaWhereInput = {
      usuarioId: usuarioId,
      AND: [
        {
          OR: [
            // Condição 1: Reservas PASSADAS (dataFim anterior ao início do dia atual), com QUALQUER status
            {
              dataFim: {
                lt: dataAtual,
              }
            },
            // Condição 2: Reservas de HOJE que já foram CONCLUIDAS ou CANCELADAS
            {
              dataFim: {
                gte: dataAtual,
                lt: agora
              },
              status_reserva: {
                nome_status: {
                  in: ['CANCELADA', 'CONCLUIDA']
                }
              }
            }
          ]
        }
      ]
    };

    // Consulta as reservas do usuário paginadas
    const minhasReservas = await this.prisma.reserva.findMany({
      where: condicoesFiltro,
      include: {
        usuario: { select: { id: true, nome: true, email: true, tipo_usuario: true } },
        sala: { include: { tipo_sala: true } },
        status_reserva: true,
      },
      orderBy: {
        dataInicio: 'desc',
      },
      skip: pularRegistros, // Pula registros
      take: limite,        // Limita a quantidade de registros
    });

    // Consulta o total de reservas do usuário que correspondem às condições
    const totalMinhasReservas = await this.prisma.reserva.count({
      where: condicoesFiltro,
    });

    return {
      data: minhasReservas,
      total: totalMinhasReservas,
      paginaAtual: pagina,
      itensPorPagina: limite,
      totalPaginas: Math.ceil(totalMinhasReservas / limite),
    };
  }

  async findAll(pagina: number = 1, limite: number = 10): Promise<PaginatedReservas> {
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    const inicioDoDiaAtual = new Date(dataAtual);
    inicioDoDiaAtual.setHours(0, 0, 0, 0);

    const agora = new Date();

    const pularRegistros = (pagina - 1) * limite; // Calcula quantos registros pular

    const condicoesFiltro: Prisma.ReservaWhereInput = {
      OR: [
        {
          dataFim: {
            lt: inicioDoDiaAtual,
          }
        },
        {
          dataFim: {
            gte: inicioDoDiaAtual,
            lt: agora
          },
          status_reserva: {
            nome_status: {
              in: ['CANCELADA', 'CONCLUIDA']
            }
          }
        }
      ]
    };

    // Consulta as reservas paginadas
    const reservas = await this.prisma.reserva.findMany({
      where: condicoesFiltro,
      include: {
        usuario: { include: { tipo_usuario: true } },
        sala: { include: { tipo_sala: true } },
        status_reserva: true,
      },
      orderBy: {
        dataInicio: 'desc',
      },
      skip: pularRegistros, // Pula registros
      take: limite,        // Limita a quantidade de registros
    });

    // Consulta o total de reservas que correspondem às condições
    const totalReservas = await this.prisma.reserva.count({
      where: condicoesFiltro,
    });

    return {
      data: reservas,
      total: totalReservas,
      paginaAtual: pagina,
      itensPorPagina: limite,
      totalPaginas: Math.ceil(totalReservas / limite),
    };
  }

  async findOne(id: number) {
    const reserva = await this.prisma.reserva.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, nome: true, email: true, tipo_usuario: true } },
        sala: { include: { tipo_sala: true } },
        status_reserva: true,
      },
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva com ID ${id} não encontrada.`);
    }

    return reserva;
  }

  async update(id: number, dadosAtualizacaoReserva: UpdateReservaDto) {
    const reservaExistente = await this.prisma.reserva.findUnique({ where: { id } });
    if (!reservaExistente) {
      throw new NotFoundException(`Reserva com ID ${id} não encontrada para atualização.`);
    }

    if (dadosAtualizacaoReserva.statusReservaId 
      && dadosAtualizacaoReserva.statusReservaId !== reservaExistente.statusReservaId) {
      const novoStatus = await this.prisma.status_reserva.findUnique({ where: { id: dadosAtualizacaoReserva.statusReservaId } });
      const statusAntigo = await this.prisma.status_reserva.findUnique({ where: { id: reservaExistente.statusReservaId } });
      console.log(`Notificação: Status da reserva ${id} mudou de ${statusAntigo?.nome_status || 'desconhecido'} para ${novoStatus?.nome_status || 'desconhecido'}.`);
    }

    // if (dadosAtualizacaoReserva.dataInicio || 
    //     dadosAtualizacaoReserva.dataFim || 
    //     dadosAtualizacaoReserva.salaId) {
    //   // const novaDataInicio = dadosAtualizacaoReserva.dataInicio ? new Date(dadosAtualizacaoReserva.dataInicio) 
    //   //                                                             : reservaExistente.dataInicio;
    //   // const novaDataFim = dadosAtualizacaoReserva.dataFim ? new Date(dadosAtualizacaoReserva.dataFim) 
    //                                                               // : reservaExistente.dataFim;
    //   const novaSalaId = dadosAtualizacaoReserva.salaId 
    //                       || reservaExistente.salaId;

    //   // if (novaDataInicio >= novaDataFim) { 
    //   //   throw new BadRequestException('A nova data de início deve ser anterior à nova data de fim.');
    //   // }

    //   const conflitoExistente = await this.prisma.reserva.findFirst({
    //     where: {
    //       id: { not: id },
    //       salaId: novaSalaId,
    //       status_reserva: { 
    //         nome_status: {
    //           in: ['PENDENTE', 'EM_ANDAMENTO']
    //         }
    //       },
    //       // OR: [
    //       //   {
    //       //     dataInicio: { lt: novaDataFim },
    //       //     dataFim: { gt: novaDataInicio },
    //       //   },
    //       // ],
    //     },
    //   });

    //   if (conflitoExistente) {
    //     throw new ConflictException(`Horário indisponível para a sala ${novaSalaId} no período solicitado.`);
    //   }
    // }

    const { statusReservaId, usuarioId, salaId, ...camposAtualizacaoDireta } = dadosAtualizacaoReserva;

    const dados: Prisma.ReservaUpdateInput = { ...camposAtualizacaoDireta };

    if (statusReservaId !== undefined) {
      dados.status_reserva = {
        connect: { id: statusReservaId }
      };
    }
    if (usuarioId !== undefined) {
      dados.usuario = {
        connect: { id: usuarioId }
      };
    }
    if (salaId !== undefined) {
      dados.sala = {
        connect: { id: salaId }
      };
    }

    const reservaAtualizada = await this.prisma.reserva.update({
      where: { id },
      data: dados,
      include: {
        usuario: { select: { id: true, nome: true, email: true, tipo_usuario: true } },
        sala: { include: { tipo_sala: true } },
        status_reserva: true,
      },
    });

    return reservaAtualizada;
  }

  async remove(id: number): Promise<void> {
    const reservaExistente = await this.prisma.reserva.findUnique({ where: { id } });
    if (!reservaExistente) {
      throw new NotFoundException(`Reserva com ID ${id} não encontrada para remoção.`);
    }

    await this.prisma.reserva.delete({ where: { id } });
    console.log(`Reserva ${id} removida/cancelada.`);
  }

  async updateMany(dadosAtualizacao: Prisma.ReservaUpdateManyArgs) {
    const resultado = await this.prisma.reserva.updateMany(dadosAtualizacao);
    if (resultado.count === 0) {
      throw new NotFoundException('Nenhuma reserva encontrada para atualizar com os critérios fornecidos.');
    }
    return resultado;
  }
}