import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
  ) {}

  async getAll() {
    return await this.recadoRepository.find();
  }

  async getOne(id: number) {
    // get the target registry
    const target = await this.recadoRepository.findOne({ where: { id } });

    // return registry or throw 404 exception
    if (target) {
      // update 'seen' status
      const updated = await this.update(id, { seen: true });
      return updated;
    } else {
      throw new NotFoundException();
    }
  }

  async create(createRecadoDto: CreateRecadoDto) {
    // get values
    const { recado, from, to } = createRecadoDto;

    //  create registry
    return await this.recadoRepository.save([{ recado, from, to }]);
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    // check if id is present
    if (id === undefined) {
      throw new BadRequestException('Missing id.');
    }

    // get values
    const { from, to, seen } = updateRecadoDto;

    // update registry if it already exists
    const target = await this.recadoRepository.preload({ id, from, to, seen });

    // update registry or throw 404 exception
    if (target) {
      return await this.recadoRepository.save([target]);
    } else {
      throw new NotFoundException();
    }
  }

  async remove(id: number) {
    const affected = (await this.recadoRepository.delete(id)).affected;

    if (!affected) {
      throw new NotFoundException();
    }
  }
}
