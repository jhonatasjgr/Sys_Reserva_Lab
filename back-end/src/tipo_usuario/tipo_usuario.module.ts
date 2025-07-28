import { Module } from '@nestjs/common';
import { TipoUsuarioService } from './tipo_usuario.service';
import { TipoUsuarioController } from './tipo_usuario.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TipoUsuarioController],
  providers: [TipoUsuarioService],
  imports: [PrismaModule],
})
export class TipoUsuarioModule {}
