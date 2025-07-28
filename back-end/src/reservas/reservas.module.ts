import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SalasService } from 'src/salas/salas.service';
import { SalasModule } from 'src/salas/salas.module';
import { ReservasTasksService } from './reservas-task';

@Module({
  controllers: [ReservasController],
  providers: [ReservasService, ReservasTasksService],
  imports: [PrismaModule, SalasModule],
})
export class ReservasModule {}
