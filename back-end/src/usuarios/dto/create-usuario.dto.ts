import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, IsEnum, IsNumber } from 'class-validator';
import { TipoUsuario } from 'src/tipo_usuario/entities/tipo_usuario.entity';


export class CreateUsuarioDto {

  nome: string;
  email: string;
  senha: string;
  tipo_usuarioId: number;
}