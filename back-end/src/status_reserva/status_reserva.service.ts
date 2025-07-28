import { Injectable } from '@nestjs/common';
import { CreateStatusReservaDto } from './dto/create-status_reserva.dto';
import { UpdateStatusReservaDto } from './dto/update-status_reserva.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatusReservaService {
  constructor(private prisma: PrismaService){

  }
  create(createStatusReservaDto: CreateStatusReservaDto) {
    return this.prisma.status_reserva.create({
      data: {
        nome_status: createStatusReservaDto.nome_status,
      }
    });
  }

  findAll() {
    return this.prisma.status_reserva.findMany();
  }

  findOne(id: number) {
    return this.prisma.status_reserva.findUnique({
      where: {
        id: id,
      }
    });
  }

  update(id: number, updateStatusReservaDto: UpdateStatusReservaDto) {
    return `This action updates a #${id} statusReserva`;
  }

  remove(id: number) {
    return `This action removes a #${id} statusReserva`;
  }
}
