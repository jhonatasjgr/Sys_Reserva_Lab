import { PartialType } from '@nestjs/swagger';
import { CreateStatusReservaDto } from './create-status_reserva.dto';

export class UpdateStatusReservaDto extends PartialType(CreateStatusReservaDto) {}
