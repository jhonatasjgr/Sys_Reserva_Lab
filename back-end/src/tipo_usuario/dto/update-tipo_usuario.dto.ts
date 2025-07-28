import { PartialType } from '@nestjs/swagger';
import { CreateTipoUsuarioDto } from './create-tipo_usuario.dto';

export class UpdateTipoUsuarioDto extends PartialType(CreateTipoUsuarioDto) {}
