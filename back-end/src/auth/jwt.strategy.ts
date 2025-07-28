//src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from './auth.module';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { tipo_usuario } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usuarioService: UsuariosService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { userId: number, tipo: tipo_usuario }) {
    console.log('JwtStrategy: Payload recebido:', payload); 
    console.log('JwtStrategy: userId do payload:', payload.userId); 
    console.log('JwtStrategy: tipo do payload:', payload.tipo); 

    if (payload.userId === undefined || payload.userId === null) {
        console.error('JwtStrategy: userId é undefined ou null no payload do token. Token inválido.');
        throw new UnauthorizedException('Token inválido: userId ausente.');
    }

    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, tipo_usuario: true, nome: true }, 
    });

    if (!user) {
      console.error(`JwtStrategy: Usuário com ID ${payload.userId} não encontrado no banco de dados.`);
      throw new UnauthorizedException('Usuário não encontrado.');
    }

  
    return user;
  }
}
