import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsInt, Min, IsEnum } from 'class-validator';
import { tipo_sala } from 'generated/prisma';


export class CreateSalaDto {

  nome: string;
  tipoSalaId: number;
  capacidade: number;
}