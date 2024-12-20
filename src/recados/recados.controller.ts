import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  async getAll(@Query() paginationDto: PaginationDto) {
    return await this.recadosService.getAll(paginationDto);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.recadosService.getOne(id, true);
  }

  @Post()
  async create(@Body() createRecadoDto: CreateRecadoDto) {
    return await this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedRecadoDto: UpdateRecadoDto,
  ) {
    return await this.recadosService.update(id, updatedRecadoDto);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.recadosService.remove(id);
  }
}
