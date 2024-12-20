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
import { PessoaService } from 'src/pessoa/pessoa.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoaService: PessoaService,
  ) {}

  async getAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.recadoRepository.find({ take: limit, skip: offset });
  }

  async getOne(id: number, updateSeen: boolean = false) {
    // get the target registry
    const target = await this.recadoRepository.findOne({
      where: { id },
      relations: ['from', 'to'],
    });

    // return registry or throw 404 exception
    if (target) {
      // hide sensitive information
      const result = {
        ...target,
        from: { name: target.from.name },
        to: { name: target.to.name },
      };

      // update 'seen' status
      if (updateSeen && !target.seen) {
        const updated = await this.update(id, { seen: true });
        return { ...result, seen: updated.seen };
      }
      return result;
    } else {
      throw new NotFoundException();
    }
  }

  async create(createRecadoDto: CreateRecadoDto) {
    // get values
    const { recado, from, to } = createRecadoDto;

    // find sender
    const sender = await this.pessoaService.findOne(from);

    // finde receiver
    const receiver = await this.pessoaService.findOne(to);

    //  create registry
    const newRecado = this.recadoRepository.create({
      recado,
      from: sender,
      to: receiver,
    });

    await this.recadoRepository.save(newRecado);

    return {
      ...newRecado,
      from: { name: sender.name },
      to: { name: receiver.name },
    };
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    // check if id is present
    if (id === undefined) {
      throw new BadRequestException('Missing id.');
    }

    // search for the original registry
    const original = this.getOne(id);

    // get values
    const { recado, seen } = updateRecadoDto;

    // update registry if it already exists
    const target = await this.recadoRepository.preload({ id, recado, seen });

    // update registry or throw 404 exception
    if (original) {
      // save changes
      await this.recadoRepository.save(target);
      return { ...target, ...original };
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
