import { Module } from '@nestjs/common';
import { TipoSalaService } from './tipo_sala.service';
import { TipoSalaController } from './tipo_sala.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TipoSalaController],
  providers: [TipoSalaService],
  imports:[PrismaModule]
})
export class TipoSalaModule {}
