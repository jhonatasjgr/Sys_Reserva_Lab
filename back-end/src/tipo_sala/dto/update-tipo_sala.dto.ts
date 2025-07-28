import { PartialType } from '@nestjs/swagger';
import { CreateTipoSalaDto } from './create-tipo_sala.dto';

export class UpdateTipoSalaDto extends PartialType(CreateTipoSalaDto) {}
