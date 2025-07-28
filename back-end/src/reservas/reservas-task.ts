// back-end/src/reservas/reservas-tasks.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservasService } from './reservas.service'; // Seu serviço de reservas
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReservasTasksService implements OnModuleInit {

  private readonly logger = new Logger(ReservasTasksService.name);

  constructor(private readonly reservasService: ReservasService) {}
  
  async onModuleInit() { // metodo chamado quando o modulo é inicializado
    this.logger.log('Iniciando na inicialização do módulo: Verificação de reservas em atraso.');
    await this.atualizarReservasEmAtraso();
    this.logger.log('Verificação de reservas em atraso concluída na inicialização.');
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM) // define que essa função será executada diariamente às 6 da manhã
  async handleReservasAtrasadasCron() {
    console.log('Tarefa agendada: Verificação de reservas em atraso iniciada.');
    this.logger.log('Iniciando tarefa agendada: Verificação de reservas em atraso.');
    await this.atualizarReservasEmAtraso();
    this.logger.log('Tarefa agendada concluída: Verificação de reservas em atraso.');
  }

  async atualizarReservasEmAtraso() {
    const dataAtual = new Date();
    const inicioDoDiaAtual = new Date(dataAtual); // data atual sem hora
    inicioDoDiaAtual.setHours(0, 0, 0, 0);

    try {

        const statusEmAtraso = 5;  // mudar para pegar o banco
        const statusEmAndamento = 2; // mudar para pegar o banco

      if (!statusEmAtraso || !statusEmAndamento) {
        this.logger.error('Status "EM_ATRASO" ou "EM_ANDAMENTO" não encontrado no DB. Verifique a tabela status_reserva.');
        return;
      }

      const reservasEmAndamento = await this.reservasService.getReservasPassadasEmAndamento();

      const reservasParaAtualizar = reservasEmAndamento.filter(reserva => {
        const dataFimReserva = new Date(reserva.dataFim); // data fim da reserva
        return dataFimReserva < inicioDoDiaAtual && reserva.statusReservaId === statusEmAndamento;
        // data fim da reserva é anterior ao início do dia atual e o status é 'EM_ANDAMENTO'
      });

      if (reservasParaAtualizar.length === 0) {
        this.logger.log('Nenhuma reserva em andamento passada encontrada para atualizar.');
        return;
      }

      // 3. Atualizar o status para 'EM_ATRASO' para cada reserva encontrada
      const idsReservasParaAtualizar = reservasParaAtualizar.map(reserva => reserva.id);

      const resultadoAtualizacao = await this.reservasService.updateMany({
        where: {
          id: { in: idsReservasParaAtualizar },
        },
        data: {
          statusReservaId: 5, // atualiza para o ID de 'EM_ATRASO' 5
        },
      });

      this.logger.log(`Total de reservas atualizadas para 'EM_ATRASO': ${resultadoAtualizacao.count}`);

    } catch (error) {
      this.logger.error('Erro ao processar reservas em atraso:', error.stack);
    }
  }
}