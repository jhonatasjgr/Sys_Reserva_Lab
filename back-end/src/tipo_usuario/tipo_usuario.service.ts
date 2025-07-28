import { Injectable } from '@nestjs/common';
import { CreateTipoUsuarioDto } from './dto/create-tipo_usuario.dto';
import { UpdateTipoUsuarioDto } from './dto/update-tipo_usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TipoUsuarioService {
  constructor(private prisma: PrismaService) {}
  create(createTipoUsuarioDto: CreateTipoUsuarioDto) {
    return this.prisma.tipo_usuario.create({
      data: {
        nome_tipo: createTipoUsuarioDto.nome_tipo,
      },
    });
  }

  findAll() {
    return this.prisma.tipo_usuario.findMany();
  }

  findOne(id: number) {
    return this.prisma.tipo_usuario.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateTipoUsuarioDto: UpdateTipoUsuarioDto) {
    return `This action updates a #${id} tipoUsuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoUsuario`;
  }
}
