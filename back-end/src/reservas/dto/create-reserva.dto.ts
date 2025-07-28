import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { status_reserva } from 'generated/prisma';

export class CreateReservaDto {
  
  usuarioId: number;
  salaId: number;
  dataInicio: string; 
  dataFim: string; 
  observacao?: string;
  statusReservaId: number; 
}