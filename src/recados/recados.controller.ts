import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { CreateRecadoDto } from './dto/create-recado.dto';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  getAll() {
    return this.recadosService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    const recado = this.recadosService.getOne(id);
    if (recado === undefined) {
      throw new NotFoundException();
    } else {
      return recado;
    }
  }

  @Post()
  create(@Body() createRecadoDto: CreateRecadoDto) {
    return this.recadosService.create(createRecadoDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedRecadoDto: UpdateRecadoDto,
  ) {
    if (id === undefined) {
      throw new BadRequestException('Missing id.');
    }

    const updatedRecado = this.recadosService.update(id, updatedRecadoDto);
    if (updatedRecado !== undefined) {
      return updatedRecado;
    } else {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const success = this.recadosService.remove(id);
    if (!success) {
      throw new NotFoundException();
    } else {
      return 'Deleted';
    }
  }
}
