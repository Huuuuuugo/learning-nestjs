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

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoaService: PessoaService,
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

    // get values
    const { recado, seen } = updateRecadoDto;

    // update registry if it already exists
    const target = await this.recadoRepository.preload({ id, recado, seen });

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
