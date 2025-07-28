import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoSalaService } from './tipo_sala.service';
import { CreateTipoSalaDto } from './dto/create-tipo_sala.dto';
import { UpdateTipoSalaDto } from './dto/update-tipo_sala.dto';

@Controller('tipo-sala')
export class TipoSalaController {
  constructor(private readonly tipoSalaService: TipoSalaService) {}

  @Post()
  create(@Body() createTipoSalaDto: CreateTipoSalaDto) {
    return this.tipoSalaService.create(createTipoSalaDto);
  }

  @Get()
  findAll() {
    return this.tipoSalaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoSalaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoSalaDto: UpdateTipoSalaDto) {
    return this.tipoSalaService.update(+id, updateTipoSalaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoSalaService.remove(+id);
  }
}
