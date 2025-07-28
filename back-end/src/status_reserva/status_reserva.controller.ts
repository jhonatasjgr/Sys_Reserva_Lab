import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusReservaService } from './status_reserva.service';
import { CreateStatusReservaDto } from './dto/create-status_reserva.dto';
import { UpdateStatusReservaDto } from './dto/update-status_reserva.dto';

@Controller('status-reserva')
export class StatusReservaController {
  constructor(private readonly statusReservaService: StatusReservaService) {}

  @Post()
  create(@Body() createStatusReservaDto: CreateStatusReservaDto) {
    return this.statusReservaService.create(createStatusReservaDto);
  }

  @Get()
  findAll() {
    return this.statusReservaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusReservaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatusReservaDto: UpdateStatusReservaDto) {
    return this.statusReservaService.update(+id, updateStatusReservaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusReservaService.remove(+id);
  }
}
