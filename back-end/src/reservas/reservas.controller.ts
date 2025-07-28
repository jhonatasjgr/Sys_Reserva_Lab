import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, // Para proteção de rotas com guards de autenticação e autorização
  Req,       // Para acessar o objeto de requisição e obter dados do usuário autenticado
  Query,     // Para obter parâmetros de consulta da URL (ex: data para disponibilidade)
  BadRequestException, // Para lidar com erros de requisição inválida
  HttpCode, // Para definir códigos de status HTTP específicos
  HttpStatus, // Para usar os códigos de status HTTP
  ParseIntPipe
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; 
import {
  ApiTags,   
  ApiResponse,
  ApiBearerAuth,     
  ApiOperation,  
  ApiQuery,   
  ApiParam   
} from '@nestjs/swagger';
import { tipo_usuario } from 'generated/prisma';



@ApiTags('reservas') 
@ApiBearerAuth()  
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

    @Get('/reservas-pendentes') // Rota para reservas pendentes do dia
  // @UseGuards(JwtAuthGuard, RolesGuard) // <<-- Mantenha seus guards
  // @Roles(tipo_usuario.ADMINISTRADOR, tipo_usuario.PROFESSOR) // <<-- Mantenha seus roles
  @ApiOperation({ summary: 'Lista todas as reservas pendentes do dia com paginação (Admin/Professor)' })
  @ApiQuery({ name: 'pagina', required: false, type: Number, description: 'Número da página (padrão: 1)' }) // <<-- Adicionado para Swagger
  @ApiQuery({ name: 'limite', required: false, type: Number, description: 'Itens por página (padrão: 10)' }) // <<-- Adicionado para Swagger
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de reservas pendentes paginadas.' /* type: [ReadReservaDto] */ })
  async getReservasPendentes(
    @Query('pagina', new ParseIntPipe({ optional: true })) pagina?: number, // <<-- Recebe pagina
    @Query('limite', new ParseIntPipe({ optional: true })) limite?: number // <<-- Recebe limite
  ) {
    return this.reservasService.getReservasPendentes(); // <<-- Passa os parâmetros
  }

    @Get('/reservas-em-andamento')
    @ApiOperation({ summary: 'Lista todas as reservas em andamento do dia' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Lista de reservas em andamento.' })
    async getReservasEmAndamento(@Req() req: any) {
      return this.reservasService.getReservasEmAndamento();
    } 
    @Get('/reservas-ativas') // reservas ativas do usuário autenticado
    @UseGuards(JwtAuthGuard) 
    @ApiOperation({ summary: 'Lista todas as reservas ativas do usuário autenticado' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Lista de reservas ativas do usuário.' })
    async getReservasAtivas(@Req() req: any) {
      console.log('ID do usuário autenticado:', req.user.id);
      return this.reservasService.getReservasAtivas(req.user.id); 
    }

     @Get('minhas-reservas') // Histórico de reservas do usuário autenticado
  @UseGuards(JwtAuthGuard) // Apenas usuários autenticados (qualquer papel) podem ver suas próprias reservas
  @ApiOperation({ summary: 'Lista todas as reservas do usuário autenticado com paginação' }) // <<-- Atualizado Swagger
  @ApiQuery({ name: 'pagina', required: false, type: Number, description: 'Número da página (padrão: 1)' }) // <<-- Adicionado para Swagger
  @ApiQuery({ name: 'limite', required: false, type: Number, description: 'Itens por página (padrão: 10)' }) // <<-- Adicionado para Swagger
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de reservas do usuário paginadas.' /* type: [ReadReservaDto] */ }) // <<-- Atualizado Swagger
  async getMinhasReservas(
    @Req() req: any,
    @Query('pagina', new ParseIntPipe({ optional: true })) pagina?: number, // <<-- Recebe pagina
    @Query('limite', new ParseIntPipe({ optional: true })) limite?: number // <<-- Recebe limite
  ) {
    return this.reservasService.getMinhasReservas(req.user.id, pagina, limite);
  }



  @Post()
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Cria uma nova solicitação de reserva' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Reserva criada com sucesso.',
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflito de horário para a sala.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos (ex: data de início >= data de fim).' })
  async create(
    @Body() createReservaDto: CreateReservaDto,
    @Req() req: any 
  ){
    createReservaDto.usuarioId = req.user.id;
    return this.reservasService.create(createReservaDto);
  }

  @Get() // todas as reservas do sistema
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Lista todas as reservas do sistema (disponível para Admin e Professor)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de todas as reservas.'})
   findAll(
    @Query('pagina', new ParseIntPipe({ optional: true })) pagina?: number,
    @Query('limite', new ParseIntPipe({ optional: true })) limite?: number
  ) {
    return this.reservasService.findAll(pagina, limite);
  }



  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Busca os detalhes de uma reserva específica por ID (disponível para Admin e Professor)' })
  @ApiParam({ name: 'id', description: 'ID da reserva', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Detalhes da reserva.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reserva não encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number){
    return this.reservasService.findOne(+id);
  }



  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualiza detalhes de uma reserva existente (disponível para Admin e Professor)' })
  @ApiParam({ name: 'id', description: 'ID da reserva', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reserva atualizada com sucesso.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reserva não encontrada.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflito de horário ao atualizar a reserva.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos.' })
  update(
     @Param('id', ParseIntPipe) id: number,
    @Body() updateReservaDto: UpdateReservaDto
  ){
    return this.reservasService.update(+id, updateReservaDto);
  }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // @HttpCode(HttpStatus.NO_CONTENT) 
  // @ApiOperation({ summary: 'Cancela ou exclui uma reserva (disponível para Admin e Professor)' })
  // @ApiParam({ name: 'id', description: 'ID da reserva', type: Number })
  // @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Reserva removida com sucesso.' })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reserva não encontrada.' })
  // remove(@Param('id', ParseIntPipe) id: number,): Promise<void> {
  //   return this.reservasService.remove(+id);
  // }


}