import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bycrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

export const roundsOfHashing = 10;

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {

      const hashedsenha = await bycrypt.hash(
        createUsuarioDto.senha,
        roundsOfHashing
      );

      const { tipo_usuarioId, ...restoUsuarioDto } = createUsuarioDto;

      
      const tipoUsuarioExistente = await this.prisma.tipo_usuario.findUnique({
        where: { id: tipo_usuarioId },
      });

      if (!tipoUsuarioExistente) {
        throw new NotFoundException(`Tipo de usuário com ID '${tipo_usuarioId}' não encontrado.`);
      }

      const novoUsuario = await this.prisma.usuario.create({
        data: {
          ...restoUsuarioDto,
          senha: hashedsenha,
          tipo_usuario: {
            connect: {
              id: tipo_usuarioId,
            },
          },
        },
        include: {
          tipo_usuario: true, 
        },
      });

      return novoUsuario;
    } catch (error: any) {
      console.error('Erro detalhado ao criar usuário:', error);

      // Tratamento de erros específicos do Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        
        // Erro P2003: Falha na restrição de chave estrangeira (ex: tipo_usuarioId não existe)
        // Embora a verificação proativa ajude, este é um fallback
        if (error.code === 'P2003') {
          throw new BadRequestException('Erro de relacionamento: dados relacionados (como tipo de usuário) não encontrados ou inválidos.');
        }
        // Erro P2025: Registro necessário não encontrado (ex: 'connect' falhou porque o registro não existe)
        // Este é o erro que você estava recebendo inicialmente.
        if (error.code === 'P2025') {
            throw new NotFoundException(`Erro de relacionamento: ${error.meta?.cause || 'registro relacionado não encontrado'}.`);
        }
        // Tratamento genérico para outros erros conhecidos do Prisma
        throw new BadRequestException(`Erro do banco de dados: ${error.message}`);
      }
      // Tratamento de erros desconhecidos do Prisma
      else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        // Se você tiver mensagens de erro específicas do banco de dados que não são P2002, P2003, P2025
        // e vêm como UnknownRequestError, você pode tratá-las aqui.
        // Por exemplo, se o banco de dados retornar uma mensagem customizada para e-mail duplicado
        // que não é capturada por P2002.
        if (error.message && error.message.includes('E-mail já cadastrado. Por favor, use outro e-mail.')) {
          throw new ConflictException('E-mail já cadastrado. Por favor, use outro e-mail.');
        }
        throw new BadRequestException(`Erro no banco de dados (desconhecido): ${error.message}`);
      }
      // Tratamento para erros gerais do JavaScript/TypeScript
      else if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      // Tratamento para qualquer outro tipo de erro não capturado
      throw new InternalServerErrorException('Erro interno do servidor ao criar usuário. Tente novamente mais tarde.');
    }
  }

  findAll() {
    return this.prisma.usuario.findMany({
      include: {
        tipo_usuario: true, 
      },
      orderBy: {
        nome: 'asc', 
      },
    });
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      include:{
        tipo_usuario: true, 
        
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUsuarioDto) {
    if (updateUserDto.senha) {
      updateUserDto.senha = await bycrypt.hash(
        updateUserDto.senha,
        roundsOfHashing,
      );
    }
    return this.prisma.usuario.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({where: { id }});
  }
}
