import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { LogInterceptor } from 'src/common/interceptors/log.interceptor';

@Controller('pessoa')
@UseInterceptors(LogInterceptor)
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Post()
  async create(@Body() createPessoaDto: CreatePessoaDto) {
    return await this.pessoaService.create(createPessoaDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.pessoaService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePessoaDto: UpdatePessoaDto,
  ) {
    return await this.pessoaService.update(id, updatePessoaDto);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.pessoaService.remove(id);
  }
}
