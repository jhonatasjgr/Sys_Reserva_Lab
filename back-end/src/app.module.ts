import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SalasModule } from './salas/salas.module';
import { ReservasModule } from './reservas/reservas.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TipoUsuarioModule } from './tipo_usuario/tipo_usuario.module';
import { TipoSalaModule } from './tipo_sala/tipo_sala.module';
import { StatusReservaModule } from './status_reserva/status_reserva.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, UsuariosModule, SalasModule, ReservasModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis de ambiente acessíveis globalmente
      envFilePath: '.env', // Caminho do arquivo .env
    }),
    TipoUsuarioModule,
    TipoSalaModule,
    ScheduleModule.forRoot(),
    StatusReservaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
