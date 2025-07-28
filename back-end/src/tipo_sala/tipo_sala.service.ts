import { Injectable } from '@nestjs/common';
import { CreateTipoSalaDto } from './dto/create-tipo_sala.dto';
import { UpdateTipoSalaDto } from './dto/update-tipo_sala.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TipoSalaService {
  constructor(private prisma: PrismaService) {}
  create(createTipoSalaDto: CreateTipoSalaDto) {
    return this.prisma.tipo_sala.create({
      data: {
        nome_tipo: createTipoSalaDto.nome_tipo,
      },
      });
  }

  findAll() {
    return this.prisma.tipo_sala.findMany();
  }

  findOne(id: number) {
    return this.prisma.tipo_sala.findUnique({
      where: {
        id: id,
      }
    });
  }

  update(id: number, updateTipoSalaDto: UpdateTipoSalaDto) {
    return `This action updates a #${id} tipoSala`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoSala`;
  }
}
