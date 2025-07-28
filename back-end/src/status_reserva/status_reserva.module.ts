import { Module } from '@nestjs/common';
import { StatusReservaService } from './status_reserva.service';
import { StatusReservaController } from './status_reserva.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [StatusReservaController],
  providers: [StatusReservaService],
  imports: [PrismaModule],
})
export class StatusReservaModule {}
