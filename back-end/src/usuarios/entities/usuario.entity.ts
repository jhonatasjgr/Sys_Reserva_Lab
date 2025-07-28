import { ApiProperty } from "@nestjs/swagger";
import { tipo_usuario } from "generated/prisma";

export class Usuario {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nome: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    senha: string;

    @ApiProperty()
    tipo: tipo_usuario;

    @ApiProperty()
    reservas: any[]; 
  
    @ApiProperty()
    createdAt: Date;
    
    @ApiProperty()
    updatedAt: Date;
}
