import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { connect } from 'http2';
import { Sala } from './entities/sala.entity';


@Injectable()
export class SalasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSalaDto: CreateSalaDto){

    const {tipoSalaId, ...resto} = createSalaDto;
    
    const newSala = await this.prisma.sala.create({
      data:{
        ...resto,
        tipo_sala: {
          connect: {
            id: createSalaDto.tipoSalaId, // Conectando ao tipo de sala pelo ID
          },
        },
      },
    });
    return newSala; 
  }

  async findAll(){
   
    return this.prisma.sala.findMany();
  }

  async findOne(id: number){
    
    const sala = await this.prisma.sala.findUnique({
      where: { id },
    });

    if (!sala) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada.`);
    }
    return sala;
  }

  async update(id: number, updateSalaDto: UpdateSalaDto){
    const existingSala = await this.prisma.sala.findUnique({ where: { id } });
    if (!existingSala) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada para atualização.`);
    }

    const updatedSala = await this.prisma.sala.update({
      where: { id },
      data: updateSalaDto,
    });
    return updatedSala;
  }

  async remove(id: number): Promise<void> { 
    const existingSala = await this.prisma.sala.findUnique({ where: { id } });
    if (!existingSala) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada para remoção.`);
    }

    await this.prisma.sala.delete({ where: { id } });
  }
}