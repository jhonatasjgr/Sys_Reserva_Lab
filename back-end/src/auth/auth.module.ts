import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

export const jwtSecret = 'zjP9h6ZI5LoSKCRj';
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [PrismaModule,
    PassportModule,
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '1h',
    //   },
    // }),
    UsuariosModule,
   JwtModule.registerAsync({ 
      imports: [], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: {
          expiresIn: '1h', 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
