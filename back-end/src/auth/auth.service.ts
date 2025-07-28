import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class AuthService {
   constructor(private prisma: PrismaService, private jwtService: JwtService) {}

   async login(email: string, senha: string) {
        console.log('Tentando fazer login com email:', email);
        const user = await this.prisma.usuario.findUnique({
            where: { email },
        });
        

        if (user?.status === false) {
            throw new UnauthorizedException('Usuário inativo');
        }


         
        
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas'); // use UnauthorizedException
        }

       if (!user.senha) {
            throw new UnauthorizedException('Senha Errada'); // use UnauthorizedException
        }

        

       
        const isPasswordValid = await bcrypt.compare(senha, user.senha);

        console.log('Resultado da comparação de senha (bcrypt):', isPasswordValid);

    if (!isPasswordValid) {
        throw new UnauthorizedException('Senha inválida');
    }

    console.log('Dados do usuário antes de assinar o token:', { userId: user.id, tipo: user.tipo_usuarioId });
    console.log('Valor de user.tipo:', user.tipo_usuarioId); 

    // return {
    //     tokenAcesso: this.jwtService.sign({ userId: user.id, tipo: user.tipo_usuarioId, username: user.nome }),
    // };
    return {
    tokenAcesso: this.jwtService.sign({ userId: user.id, tipo: user.tipo_usuarioId, username: user.nome }), // <<-- ADICIONE username: user.nome
};
    }

}
